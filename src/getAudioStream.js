const startRecording = document.getElementById('start-recording');
const stopRecording = document.getElementById('stop-recording');
let recordAudio;

const socketio = io();
const socket = socketio.on('connect', function() {
    startRecording.disabled = false
});

startRecording.onclick = function() {
    startRecording.disabled = true;

    navigator.getUserMedia({
        audio: true
    }, function(stream) {
        recordAudio = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
            sampleRate: 44100,
            desiredSampRate: 16000,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,

            timeSlice: 4000, // every 4 seconds
            ondataaavailable: function(blob) {
                console.log('data available');
                var stream = ss.createStream();
                ss(socket).emit('stream', stream, {
                    name: 'stream.wav',
                    size: blob.size
                });
                ss.createBlobReadStream(blob).pipe(stream); 
            }
        });

        recordAudio.startRecording();
        stopRecording.disabled = false;
    }, function(error) {
        console.error(JSON.stringify(error));
    });
};

const resultpreview = document.getElementById('results');
socketio.on('results', function(data) {
    console.log(data);
    if(data[0].queryResult) {
        resultpreview.innerHTML += "" + data[0].queryResult.fulfillmentText;
    }
});
