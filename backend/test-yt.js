const yt = require('youtube-transcript');
console.log(yt);
try {
  yt.YoutubeTranscript.fetchTranscript('dQw4w9WgXcQ')
    .then(t => console.log('success', t.length))
    .catch(e => console.error(e));
} catch(e) { console.error('SYNC ERR', e) }
