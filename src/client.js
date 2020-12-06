var authorizationToken;
var SpeechSDK;
var subscriptionKeyBool;
var subscriptionKey;
var serviceRegion;

async function RequestAuthorizationToken () {
  var authorizationEndpoint = 'token.php';
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
document.addEventListener('DOMContentLoaded', async function () {
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
    recognizer.startContinuousRecognitionAsync();
    var timer;
    var preventTimeoutCall;
    recognizer.recognizing = (s, e) => {
      textBox.innerHTML = e.result.text;
      console.log(`RECOGNIZING: Text=${e.result.text}`);
      if (e.result.text.length + 3 > currentSpeech.length) {
        currentSpeech = e.result.text;
        try {
          preventTimeoutCall = true;
          // clearTimeout(timer);
          console.log(preventTimeoutCall);
        } catch (e) {
          console.log('timer not initialized');
        }
        timer = setTimeout(function () {
          console.log('After setting timer: ' + preventTimeoutCall);
        }, 2000);
        console.log(currentSpeech);
      } else {
        preventTimeoutCall = false;
        clearTimeout(timer);
        console.log('Current Speech: ' + currentSpeech);
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
  })
