const express = require('express')
const cors = require('cors')

const port = 5000
const app = express()

app.use(express.json())
app.use(cors())

async function readPicture(base64string) {
    const vision = require('@google-cloud/vision');
    const request = {
        image: {
            content: base64string
        },
    };

    const client = new vision.ImageAnnotatorClient();
    const [result1] = await client.textDetection(request);
    const detections = result1.textAnnotations;
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

app.post('/readPic', async (req, res) => {
    const png = req.body.png;
    const words = readPicture(png);
    res.send(words);
})

app.listen(port, () => {
    console.log('listening')
})