let gameScore = 0;
let sessionScore = 0;

window.onload = function() {
  displayBoard(true);
  runOCR();
};

function runOCR() {
  var b64 = b64_img1;
  const data = { png: b64 };
  const readPictureURL = 'https://us-central1-quizzo-297716.cloudfunctions.net/readPic';
  fetch(readPictureURL, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
  console.log('Success:', data);
  // analyzeData(data);
  })
  .catch((error) => {
  console.error('Error:', error);
  });
}

function playGame(topic, bank, set) {
  informUser(topic, set)

  //updateBoard(store.qMap[qObjs[0]][0].q)
// ...
// delete selection from set
// display board

// playGame(topic, bank, set)

}

function analyzeData(data) {
let store = new Questions()
let qObjs = []
let validTopicStack = []

data.words.forEach(function(word) {
  if (store.isTopic(word) && !qObjs.includes(word)) {
    validTopicStack.push(word)
    qObjs.push(word)   
  }  
})

let unanswered = new Set([1, 2, 3, 4, 5])
playGame(validTopicStack.pop(), store, unanswered)


}

function displayBoard(show) {
var text = document.querySelector("a-text")
var plane = document.querySelector("a-plane")
var cylinder1 = document.getElementById("cylinder1")
var cylinder2 = document.getElementById("cylinder2")

if (show) {
  text.setAttribute("visible", true);
  plane.setAttribute("visible", true);
  cylinder1.setAttribute("visible", true)
  cylinder2.setAttribute("visible", true)  
}  else {
  text.setAttribute("visible", false);
  plane.setAttribute("visible", false);
  cylinder1.setAttribute("visible", false)
  cylinder2.setAttribute("visible", false)  
}
}

function stopARCamera() {
var arCamera = document.querySelector("a-camera") 
var scene = document.querySelector("a-scene") 

scene.removeChild(arCamera)
}

function updateBoard(message){
var text = document.querySelector("a-text")   
text.setAttribute("value", message)
}

function informUserOptions(topic, set) {
  var modal = document.getElementById("modalElement");
  var modalText = document.getElementById("messageBox");
  
  modal.style.display = "block";
  modalText.innerHTML = topic
  // display set of point options
  // display game score and session score in top left and top right
  
  setTimeout(function(modal){modal.style.display = "none"}, 6000, modal);
}

function informUserScore(sessionScore) {

}

function stopCamera(webcam) {
  webcam.stop();
}
