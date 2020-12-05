const functions = require('firebase-functions');
const cors = require('cors');
require('dotenv').config();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

async function readPicture(base64string) {
    console.log('Reading...');
    const vision = require('@google-cloud/vision');
    const request = {
        image: {
            content: base64string
        }
    };

    const client = new vision.ImageAnnotatorClient();
    const [result1] = await client.textDetection(request);
    // console.log(result1)
    const detections = await result1.textAnnotations;
    let words1 = [];
    detections.forEach(text => words1.push(text.description));
    words1.shift()
    console.log(words1);
    // const [result2] = await client.documentTextDetection(request);
    // console.log(result2);
    // const fullTextAnnotation = result.fullTextAnnotaion;
    // let words2 = [];
    // fullTextAnnotation.pages.forEach(page => {
    //     page.blocks.forEach(block => {
    //       //console.log(`Block confidence: ${block.confidence}`);
    //       block.paragraphs.forEach(paragraph => {
    //         //console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //         paragraph.words.forEach(word => {
    //           const wordText = word.symbols.map(s => s.text).join('');
    //           words2.push(wordText);
    //           //console.log(`Word text: ${wordText}`);
    //           //console.log(`Word confidence: ${word.confidence}`);
    //         //   word.symbols.forEach(symbol => {
    //         //     console.log(`Symbol text: ${symbol.text}`);
    //         //     console.log(`Symbol confidence: ${symbol.confidence}`);
    //         //   });
    //         });
    //       });
    //     });
    //   });
    return words1;
}

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');

    if(request.method === 'OPTIONS') {
        console.log('options');
        response.end();
    } else {
        console.log('Received image...')
        words = readPicture(request.body.png);
        console.log(words);
        response.status(200).send({'words': words});
    }
});


exports.readPic = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');

    if(request.method === 'OPTIONS') {
        console.log('options');
        response.end();
    } else {
        console.log('Received image...')
        words = readPicture(request.body.png);
        console.log(words);
        response.status(200).send({'words': words});
    }
});
