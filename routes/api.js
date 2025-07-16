var express = require('express');
var router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs')

// const { GoogleGenAI } = require("@google/genai");
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

const upload = multer({ dest: 'uploads/' });

function imageToGenerativePart(imagePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
            mimeType: mimeType,
        },
    };
}

router.post('/generate-from-text', async function (req, res, next) {

    const { prompt } = req.body

    console.log('prompt', prompt);
    return false

    if (prompt.length === 0) {

        // set flash message
        console.log('data kosong');

        // render to add.ejs with flash message
        res.status(500).json({ error: 'prompt tidak boleh kosong' })
    }

    if (prompt.length <= 3) {

        // set flash message
        console.log('kecil dari 3', prompt.length);

        // render to add.ejs with flash message
        res.status(500).json({ error: 'seriusly, setidaknya isi satu kaliman dengan minimal 3 huruf' })
    }

    try {

        const result = await model.generateContent(prompt)
        const response = await result.response

        res.json({ output: response.text() })
        console.log('response', response.text());
    } catch (error) {
        res.status(500).json({ error: error.message })
    }


})

router.post('/generate-from-image', upload.single('image'), async function (req, res) {

    const { prompt } = req.body
    const image = imageToGenerativePart(req.file.path, req.file.mimetype);
    console.log(prompt);
    console.log('image', image);
    return false
    try {
        console.log('success');

        const result = await model.generateContent([prompt, image])
        const response = await result.response

        res.json({ output: response.text() })
        console.log('response', response.text());
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

router.post('/generate-from-document', upload.single('document'), async function (req, res) {

    const document = imageToGenerativePart(req.file.path, "audio/mpeg");
    console.log(req.file.mimetype);

    console.log('document', document);
    return false
    // return false
    try {
        console.log('success');

        const result = await model.generateContent(['Analyze this document:', document])
        const response = await result.response

        res.json({ output: response.text() })
        console.log('response', response.text());
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

router.post('/generate-from-audio', upload.single('audio'), async function (req, res) {

    const audio = imageToGenerativePart(req.file.path, req.file.mimetype);
    console.log(req.file.mimetype);

    console.log('audio', audio);
    return false
    try {
        console.log('success');

        const result = await model.generateContent(['Transcribe or analyze the following audio :', audio])
        const response = await result.response

        res.json({ output: response.text() })
        console.log('response', response.text());
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

module.exports = router;
