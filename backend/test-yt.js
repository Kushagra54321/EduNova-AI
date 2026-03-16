const { YoutubeTranscript } = require('./utils/youtubeTranscript');

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('Xrgk023l4II');
    console.log('Success! Transcript length:', transcript.length);
    console.log('Sample:', transcript.slice(0, 3));
  } catch(e) { 
    console.error('Fetch Failed:', e.message);
  }
}

test();
