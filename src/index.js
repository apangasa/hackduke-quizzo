
const ss = require('socket.io-stream');
const content = require('fs').readFileSync('./index.html', 'utf8');
const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});
const io = require('socket.io')(httpServer);

const speech = require('@google-cloud/speech');
require('dotenv');

speechClient = new speech.SpeechClient();

request = {
    config: {
        sampleRateHertz: process.env.SAMPLE_RATE_HERTZ,
        encoding: process.env.ENCODING,
        languageCode: process.env.LANGUAGE_CODE
    },
    //interimResults: interimResults
}

io.on('connect', client => {
    client.on('message', async function(data) {
        const dataURL = data.audio.dataURL.split(',').pop();
        let fileBuffer = Buffer.from(dataURL, 'base64');

        // const results = await transcribeAudio(fileBuffer);

        // client.emit('results', results);

        transcribeAudioStream(stream, function(results) {
            client.emit('results', results);
        });
    });

    ss(client).on('stream', function(stream, data) {
        const filename = path.basename(data.name);
        stream.pipe(fs.createWriteStream(filename));
    });
});

async function transcribeAudioStream(audio, cb) {
    
    const recognizeStream = speechClient.streamingRecognize(request).on('data', function(data) {
        console.log(data);
        cb(data);
    }).on('error', (e) => {
        console.log(e);
    }).on('end', () => {
        console.log('on end');
    });

    audio.pipe(recognizeStream);
    audio.on('end', function() {} );
}

httpServer.listen(3000, () => {
    console.log('hi');
});