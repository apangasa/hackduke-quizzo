window.onload = function() {
    initiateWebCam();
};


function initiateWebCam() {
    let videoElement = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    const webcam = new Webcam(videoElement, 'user', canvas);

    webcam.start()
        .then(result =>{
        console.log("Video On");
    })
        .catch(err => {
        console.log(err);
    });

    setTimeout(function(){snapShot(webcam, canvas)}, 6000);
} 

function snapShot(webcam, canvas) {
    let png = webcam.snap();
    console.log(png)
    png = png.split(',')[1]
    
    const data = { png: png };
    const readPictureURL = 'https://31590508e157.ngrok.io/readPic';
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
    })
    .catch((error) => {
    console.error('Error:', error);
    });
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

function updateBoard(message){
  var text = document.querySelector("a-text")   
  text.setAttribute("value", message)
}

function informUser(message) {
    var modal = document.getElementById("modalElement");
    var modalText = document.getElementById("messageBox");
    
    modal.style.display = "block";
    modalText.innerHTML = message
}

