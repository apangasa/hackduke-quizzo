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
            numberOfAudioChannels: 1
        });

        recordAudio.startRecording();
        stopRecording.disabled = false;
    }, function(error) {
        console.error(JSON.stringify(error));
    });
};

stopRecording.onclick = function() {
    startRecording.disabled = false;
    stopRecording.disabled = true;

    recordAudio.stopRecording(function() {
        recordAudio.getDataURL(function(audioDataURL) {
            var files = {
                audio: {
                    type: recordAudio.getBlob().type || 'audio/wav',
                    dataURL: audioDataURL
                }
            };
            socketio.emit('message', files)
        });
    });
};

const resultpreview = document.getElementById('results');
socketio.on('results', function(data) {
    console.log(data);
    if(data[0].queryResult) {
        resultpreview.innerHTML += "" + data[0].queryResult.fulfillmentText;
    }
});