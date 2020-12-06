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
  analyzeData(data);
  })
  .catch((error) => {
  console.error('Error:', error);
  });
}

function analyzeData(data) {
let store = new Questions()
let qObjs = []
let validTopics = ""

data.words.forEach(function(word) {
  if (store.isTopic(word) && !qObjs.includes(word)) {
    validTopics +=  " " + word
    qObjs.push(word)   
  }  
})
informUser('Topics found: ' + validTopics)

updateBoard(store.qMap[qObjs[0]][0].q)
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

function informUser(message) {
  var modal = document.getElementById("modalElement");
  var modalText = document.getElementById("messageBox");
  
  modal.style.display = "block";
  modalText.innerHTML = message
  
  setTimeout(function(modal){modal.style.display = "none"}, 2000, modal);
}

function stopCamera(webcam) {
  webcam.stop();
}
