var watson = require('watson-developer-cloud');
var fs = require('fs');

var speech_to_text = watson.speech_to_text({
  username: '29f8df61-11cb-459c-b88f-ae27cddb055f',
  password: 'hi0Afw2jcgDk',
  version: 'v1'
});

var params = {
  // From file
  audio: fs.createReadStream('audio.wav'),
  content_type: 'audio/l16; rate=44100'
};

speech_to_text.recognize(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
    console.log(res.results[0].alternatives[0].transcript);
});

// or streaming
/*
fs.createReadStream('audio.wav')
  .pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=44100' }))
  .pipe(fs.createWriteStream('./transcription.txt'));*/