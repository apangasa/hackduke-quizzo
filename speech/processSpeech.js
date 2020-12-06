const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription("32c74a2f0fd842f7ba1b67a0cb6b4299", "eastus");
const phraseList = sdk.PhraseListGrammar.fromRecognizer(recognizer);
var readMode = true;
var boardMode = false
var quizMode = false;

var currentQuestion = "";
var currentAnswer = "";

function updatePhraseList() {
    phraseList.clear();
    if(readMode) {
        phraseList.addPhrase("Quizzo, quiz me");
    } else if(boardMode) {
        phraseList.addPhrase("Quizzo, give me one hundred");
        phraseList.addPhrase("Quizzo, give me two hundred");
        phraseList.addPhrase("Quizzo, give me three hundred");
        phraseList.addPhrase("Quizzo, give me four hundred");
        phraseList.addPhrase("Quizzo, give me five hundred");
    } else if(quizMode) {
        phraseList.addPhrase(currentAnswer);
    }
}

function analyzeSpeech(speechText) {
    if(speechText == "Quizzo, quiz me") {
        boardMode = true;
        readMode = false;
        updatePhraseList();
        initiateBoard();
    } else if(speechText.includes("Quizzo, give me")) {
        quizMode = true;
        boardMode = false;
    }
}

function fromMic() {
    let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
    console.log('Speak into your microphone.');
    recognizer.recognizeOnceAsync(result => {
        console.log(`RECOGNIZED: Text=${result.text}`);
    });
}
fromMic();