
var authorizationToken;
var SpeechSDK;
var subscriptionKeyBool;
var subscriptionKey;
var serviceRegion;

var readMode = true;
var boardMode = false
var quizMode = false;
var gameOverMode = false;

var question = '';

var currentAnswer = 'CanvasBoard';
//var preventTimeoutCall = false;
var currentSpeech = '';

var commands = ['Quizzo, quiz me', 'Quizzo, give me 100', 'Quizzo, give me 200', 'Quizzo, give me 300', 
                'Quizzo, give me 400', 'Quizzo, give me 500', 'Quizzo, exit', 'Quizzo, play again']


async function RequestAuthorizationToken () {
  var authorizationEndpoint = true;
  if (authorizationEndpoint) {
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Ocp-Apim-Subscription-Key', '32c74a2f0fd842f7ba1b67a0cb6b4299');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    var token;

    var result = await fetch('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken', requestOptions)
      .then(response => response.text())
      .catch(error => console.log('error', error));
    var token = await JSON.parse(atob(result.split('.')[1]));
    serviceRegion = token.region;
    authorizationToken = result;
    subscriptionKeyBool = true;
    //subscriptionKey = '';
    console.log('Got an authorization token: ' + authorizationToken);
  }
}

function updatePhraseList() {
  console.log('updating phrase list');
  phraseList.clear();
  if(readMode) {
      phraseList.addPhrase("Quizzo, quiz me");
  } else if(boardMode) {
      console.log('board mode');
      phraseList.addPhrase(currentAnswer)
      phraseList.addPhrase("Quizzo, give me 100");
      phraseList.addPhrase("Quizzo, give me 200");
      phraseList.addPhrase("Quizzo, give me 300");
      phraseList.addPhrase("Quizzo, give me 400");
      phraseList.addPhrase("Quizzo, give me 500");
  } else if(quizMode) {
      phraseList.addPhrase(currentAnswer);
  }
  //recognizer.stopContinuousRecognitionAsync();

  //recognizer.startContinuousRecognitionAsync();
}

function giveQuestion(x) {
  // if x is valid
  quizMode = true;
  boardMode = false;
}

function analyzeSpeech(speechText) {
  console.log('analyzing')
  console.log(speechText)
  //console.log(preventTimeoutCall)
  // if(!preventTimeoutCall)
  //   return;
  console.log('still analyzing')

  if(speechText == "Quizzo, quiz me" && readMode) {
      console.log('ENTERING BOARD MODE')
      boardMode = true;
      readMode = false;
      updatePhraseList();
      initiateBoard();
  } else if(speechText.includes("Quizzo, give me") && boardMode) {
      if(speechText.includes("100"))
          giveQuestion(1);
      else if(speechText.includes("200"))
          giveQuestion(2);
      else if(speechText.includes("300"))
          giveQuestion(3);
      else if(speechText.includes("400"))
          giveQuestion(4);
      else if(speechText.includes("500"))
          giveQuestion(5);
      quizMode = true;
      boardMode = false;
      updatePhraseList();
  } else if(speechText == "Quizzo, play again" && gameOverMode) {
    gameOverMode = false;
    // IF WE HAVE MORE TOPICS, boardMode = true
  } else if(speechText == "Quizzo, exit") {
    readMode = true;
    boardMode = false
    quizMode = false;
    gameOverMode = false;

    endGame()
  } else if(quizMode) {
    giveAnswer(currentSpeech);
    quizMode = false;
    boardMode = true;
  }
  // preventTimeoutCall = false;
}

document.addEventListener('DOMContentLoaded', async function () {
  document.addEventListener("click", async function(){

  if (window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    if (typeof RequestAuthorizationToken === 'function') {
      await RequestAuthorizationToken();
      console.log("loaded sdk");

    }
  }
  textBox = document.getElementById('textBox');
  textBox.innerHTML = '';
  // if we got an authorization token, use the token. Otherwise use the provided subscription key
    var speechConfig;
    if (authorizationToken) {
      console.log('speech configured');
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion);
    } else {
      if (window.SpeechSDK) {
       SpeechSDK = window.SpeechSDK;

       // in case we have a function for getting an authorization token, call it.
       if (typeof RequestAuthorizationToken === 'function') {
         await RequestAuthorizationToken();
       }
     }
      if (subscriptionKey === '' || subscriptionKey === 'subscription'||!subscriptionKey) {
        alert('No key!');
        return;
      }
      console.log(subscriptionKey);
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    }
    speechConfig.speechRecognitionLanguage = 'en-US';
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    phraseList = SpeechSDK.PhraseListGrammar.fromRecognizer(recognizer);
    phraseList.addPhrase("Quizzo, quiz me");
    commands.forEach(command => {
      phraseList.addPhrase(command);
    });
    //phraseList.addPhrase("CanvasBoard")
    recognizer.startContinuousRecognitionAsync();
    var timer;
    //var preventTimeoutCall;
    recognizer.recognizing = (s, e) => {
      textBox.innerHTML = e.result.text;
      console.log(`RECOGNIZING: Text=${e.result.text}`);
      if (e.result.text.length + 3 > currentSpeech.length) {
        currentSpeech = e.result.text;
        // try {
        //   preventTimeoutCall = true;
        //   // clearTimeout(timer);
        //   //console.log(preventTimeoutCall);
        // } catch (e) {
        //   console.log('timer not initialized');
        // }
        // timer = setTimeout(function () {
        //   analyzeSpeech(currentSpeech);
        //   console.log('After setting timer: ' + preventTimeoutCall);
        // }, 2000);
        // console.log(currentSpeech);
      } else {
        //preventTimeoutCall = false;
        //clearTimeout(timer);
        console.log('Current Speech: ' + currentSpeech);
        analyzeSpeech(currentSpeech);
        currentSpeech = e.result.text;
      }
    };
    recognizer.sessionStarted = (s, e) => {
      console.log('session started');
    };
    recognizer.speechStartDetected = (s, e) => {
      console.log('phrase logged');
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      } else if (e.result.reason === ResultReason.NoMatch) {
        console.log('NOMATCH: Speech could not be recognized.');
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason === CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you update the subscription info?');
      }

      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log('\n    Session stopped event.');
      recognizer.stopContinuousRecognitionAsync();
    };
    });
  })
