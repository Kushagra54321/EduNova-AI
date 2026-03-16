const Groq = require('groq-sdk');
const pdfParse = require('pdf-parse');
const { YoutubeTranscript } = require('../utils/youtubeTranscript');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getGroqChatCompletion = async (prompt, systemPrompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant', 
    });
    return chatCompletion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Groq API Error:", error?.error?.error || error.message || error);
    throw new Error(`AI Error: \${error?.error?.error?.message || error.message}`);
  }
};

const extractYoutubeID = (url) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.searchParams.has('v')) {
            return urlObj.searchParams.get('v');
        }
        return null;
    } catch(e) { 
        return null; 
    }
};

exports.generateSmartStudy = async (req, res) => {
  try {
    const { youtubeUrl, textTopic } = req.body;
    let sourceText = "";

    // 1. Check if a File was uploaded (PDF)
    if (req.file) {
        if (req.file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            sourceText = pdfData.text;
        } else {
            return res.status(400).json({ error: "Only PDF files are supported currently." });
        }
    } 
    // 2. Check if YouTube URL was provided
    else if (youtubeUrl) {
        const videoId = extractYoutubeID(youtubeUrl);
        if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL." });
        
        try {
            // Force fetch English transcripts if available, useful for videos from other regions
            const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
            sourceText = transcript.map(t => t.text).join(" ");
        } catch (ytErr) {
            console.error(ytErr);
            
            let userMessage = "Could not fetch transcript for this video. It may be disabled.";
            if (ytErr.message && ytErr.message.includes("disabled")) {
                userMessage = "Oops! This specific video has Subtitles/Captions disabled by the creator. Our AI needs subtitles to generate study guides. Please try another video that has CC/Subtitles enabled!";
            } else if (ytErr.message && ytErr.message.includes("No transcripts")) {
                userMessage = "No English subtitles found for this video. Please try a video with English Captions.";
            }

            return res.status(400).json({ error: userMessage });
        }
    } 
    // 3. Fallback to basic text topic if neither file nor URL
    else if (textTopic) {
        sourceText = textTopic;
    } 
    else {
        return res.status(400).json({ error: "Please provide a PDF, a YouTube URL, or a Topic." });
    }

    // Limit text to roughly 20000 characters to prevent Groq token overflow for massive PDFs
    if (sourceText.length > 20000) {
        sourceText = sourceText.substring(0, 20000);
    }

    const systemPrompt = `You are a master AI Study Assistant. The user has provided source material (from a PDF, Video, or Text).
    You must deeply analyze the material and return a strict JSON object containing EXACTLY four keys:
    1. "summary": A well-written, multi-paragraph summary.
    2. "keyPoints": An array of important bullet points (strings).
    3. "flashcards": An array of objects with "question" and "answer" strings.
    4. "quiz": An array of objects representing a 5-question multiple choice quiz.
    
    The JSON structure MUST exactly match this:
    {
        "summary": "...",
        "keyPoints": ["...", "..."],
        "flashcards": [{"question": "...", "answer": "..."}],
        "quiz": [
            {
                "question": "...",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 0
            }
        ]
    }
    DO NOT return any markdown formatting (\`\`\`json etc) outside of the raw JSON object. Ensure syntax is valid.`;

    let responseString = await getGroqChatCompletion(`Source Material: ${sourceText}`, systemPrompt);
    
    try {
        // Robustly extract JSON even if LLM prints leading/trailing conversational text
        const jsonStart = responseString.indexOf('{');
        const jsonEnd = responseString.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
             throw new Error("No JSON object found in response");
        }
        
        const cleanJsonString = responseString.slice(jsonStart, jsonEnd + 1);
        const smartData = JSON.parse(cleanJsonString);
        res.json({ result: smartData });
    } catch(parseErr) {
        console.error("Failed to parse Smart Study JSON:", responseString);
        res.status(500).json({ error: "Failed to parse AI response. The document might be too complex or too short." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
