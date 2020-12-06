const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription("32c74a2f0fd842f7ba1b67a0cb6b4299", "eastus");
const phraseList = sdk.PhraseListGrammar.fromRecognizer(recognizer);
var readMode = true;
var boardMode = false
var quizMode = false;

var words = []

var questionMap = {}

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

function initiateBoard() {
    words.forEach(word => {
        // check if words match any of the topics
    })
    // ...
}

function giveQuestion(x) {
    // ...
}

function analyzeSpeech(speechText) {
    if(speechText == "Quizzo, quiz me") {
        boardMode = true;
        readMode = false;
        updatePhraseList();
        initiateBoard();
    } else if(speechText.includes("Quizzo, give me")) {
        if(speechText.includes("one"))
            giveQuestion(1);
        else if(speechText.includes("two"))
            giveQuestion(2);
        else if(speechText.includes("three"))
            giveQuestion(3);
        else if(speechText.includes("four"))
            giveQuestion(4);
        else if(speechText.includes("five"))
            giveQuestion(5);
        quizMode = true;
        boardMode = false;
        updatePhraseList();

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