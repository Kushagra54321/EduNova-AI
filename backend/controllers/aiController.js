const Groq = require('groq-sdk');
const StudyPlan = require('../models/StudyPlan');
const QuizResult = require('../models/QuizResult');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Helper function to handle Groq API calls
const getGroqChatCompletion = async (prompt, systemPrompt = "You are EduNova AI, a helpful, intelligent, and supportive personal study assistant.") => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant', // Fast model suitable for general text tasks
    });
    return chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Groq API Error Details:", error?.error?.error || error.message || error);
    throw new Error(`AI Error: \${error?.error?.error?.message || error.message}`);
  }
};

// Controllers
exports.chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    
    // We can also accept chat history here to maintain context in a real app
    const response = await getGroqChatCompletion(prompt);
    res.json({ result: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateNotes = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const systemPrompt = `You are an expert AI Study Assistant. Generate highly structured, comprehensive, and easy-to-understand notes on the given topic. 
    Use Markdown formatting, headers, bullet points, and bold text for important keywords. 
    Keep it concise but informative, tailored for a college student revising for an exam.`;
    
    const response = await getGroqChatCompletion(`Create detailed study notes on: \${topic}`, systemPrompt);
    res.json({ result: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generatePlan = async (req, res) => {
  try {
    const { examDate, topics } = req.body;
    if (!examDate || !topics) return res.status(400).json({ error: "Exam Date and Topics are required" });

    const systemPrompt = `You are an expert Study Planner. The user will provide their exam date and the topics they need to cover. 
    You must generate a completely structured study plan. Break down the plan into 'phases' or 'blocks of days' exactly like this JSON array format, and DO NOT return anything else (no markdown, just valid JSON array):
    [
      { "day": "Day 1-3", "title": "Phase Name", "tasks": ["Task 1", "Task 2"] },
      ...
    ]`;

    let responseString = await getGroqChatCompletion(`Exam Date: \${examDate}. Topics to cover: \${topics}. Build a timeline from today until the exam date.`, systemPrompt);
    
    try {
        // Extract JSON array robustly
        const startIndex = responseString.indexOf('[');
        const endIndex = responseString.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1) {
            responseString = responseString.substring(startIndex, endIndex + 1);
        }
        
        const plan = JSON.parse(responseString);
        
        // Save to Database
        const savedPlan = await StudyPlan.create({
            user: req.user._id,
            examDate,
            topicsCovered: topics,
            plan: plan
        });

        res.json({ result: savedPlan.plan, planId: savedPlan._id });
    } catch(parseErr) {
        console.error("Failed to parse AI plan JSON:", responseString);
        // Fallback generic plan if the AI fails to return strict JSON
        res.json({ result: [
            { day: 'Phase 1', title: 'Foundation', tasks: ['Review core concepts related to the topics'] },
            { day: 'Phase 2', title: 'Deep Practice', tasks: ['Practice problems', 'Identify weak spots'] },
            { day: 'Final', title: 'Revision & Testing', tasks: ['Mock tests', 'Final reading'] }
        ]});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ result: plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const systemPrompt = `You are a strict Quiz generator. Generate 5 multiple-choice questions on the topic provided. 
    You must return a valid JSON array of objects. DO NOT return any markdown formatting outside the JSON array.
    Format exactly like this:
    [
      {
        "question": "What is ...?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0
      }
    ]
    (where correctAnswer is the index 0-3 of the right option string)`;

    let responseString = await getGroqChatCompletion(`Topic: ${topic}`, systemPrompt);
    
    try {
        // Find the first '[' and the last ']' to extract the JSON array
        const startIndex = responseString.indexOf('[');
        const endIndex = responseString.lastIndexOf(']');
        
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            responseString = responseString.substring(startIndex, endIndex + 1);
            
            // Sometimes the LLM adds trailing commas or invalid JSON formatting within the array.
            // A safer parse block:
            const quiz = JSON.parse(responseString);
            
            // Validate it has the expected structure
            if (Array.isArray(quiz) && quiz.length > 0 && quiz[0].question) {
                return res.json({ result: quiz });
            } else {
                 throw new Error("Parsed JSON does not match Quiz schema");
            }
        } else {
            throw new Error("No JSON array bracket found in LLM response");
        }
        
    } catch(parseErr) {
        console.error("Failed to parse AI quiz JSON:", responseString);
        console.error("Parse Error Details:", parseErr.message);
        res.status(500).json({ error: "Failed to generate a valid quiz formatting from AI. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { topic, score, totalQuestions } = req.body;
    
    const result = await QuizResult.create({
      user: req.user._id,
      topic,
      score,
      totalQuestions
    });

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id }).sort({ createdAt: 1 });
    
    if (!results || results.length === 0) {
       return res.json({ 
           result: {
              graphData: [], 
              aiAnalysis: "No quiz data found yet. Take a few AI quizzes to generate your Learning Analytics!" 
           }
       });
    }

    // Process data for Recharts (aggregate by topic)
    const topicStats = {};
    results.forEach(r => {
        if (!topicStats[r.topic]) {
            topicStats[r.topic] = { totalScore: 0, totalQuestions: 0, attempts: 0 };
        }
        topicStats[r.topic].totalScore += r.score;
        topicStats[r.topic].totalQuestions += r.totalQuestions;
        topicStats[r.topic].attempts += 1;
    });

    const graphData = Object.keys(topicStats).map(topic => {
        const stats = topicStats[topic];
        const percentage = Math.round((stats.totalScore / stats.totalQuestions) * 100);
        return {
            subject: topic,
            score: percentage,
            fullMark: 100
        };
    });

    // Ask AI to analyze the data
    const systemPrompt = `You are an expert Educational Data Analyst. Review the student's performance data below. 
    Write a short, encouraging 3-sentence analysis identifying their strongest subject and weakest subject. 
    Provide one actionable piece of advice on how they should adjust their Study Planner.`;
    
    const promptData = JSON.stringify(graphData);
    const aiAnalysis = await getGroqChatCompletion(`Student Performance Data: \${promptData}`, systemPrompt);

    res.json({ result: { graphData, aiAnalysis } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
