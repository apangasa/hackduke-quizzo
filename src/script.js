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
}

