const {YoutubeTranscript} = require('youtube-transcript');
console.log(typeof YoutubeTranscript);
console.log(typeof YoutubeTranscript.fetchTranscript);
YoutubeTranscript.fetchTranscript('dQw4w9WgXcQ')
  .then(res => console.log('success', res.length))
  .catch(err => console.error(err.stack));
