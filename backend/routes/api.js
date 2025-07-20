var express = require('express');
var router = express.Router();
const { gemini_generate } = require('../utils/gemini_generate');
const multer = require('multer');
const fs = require('fs')

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

        const response = await gemini_generate(prompt)

        res.json({ param: true, message: response })
        console.log('response', response);
    } catch (error) {
        res.status(500).json({ param: true, message: error.message })
    }


})

router.post('/generate-from-image', upload.single('image'), async function (req, res) {

    const { prompt } = req.body
    const image = imageToGenerativePart(req.file.path, req.file.mimetype);
    console.log(prompt);
    // console.log('image', image);
    // return false
    try {
        console.log('success');
        const response = await gemini_generate([prompt, image])
        // const result = await model.generateContent([prompt, image])
        // const response = await result.response

        res.json({ output: response })
        console.log('response', response);
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

router.post('/generate-from-document', upload.single('document'), async function (req, res) {

    if (req.file.mimetype != 'application/pdf') {
        res.status(500).json({ error: 'file harus format document / PDF' })
        exit();
    }

    const document = imageToGenerativePart(req.file.path, req.file.mimetype);
    console.log(req.file.mimetype);

    // console.log('document', document);
    // return false
    try {
        console.log('success');
        const response = await gemini_generate([{ text: "Analyze this document" }, document])

        res.json({ output: response })
        console.log('response', response);
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

router.post('/generate-from-audio', upload.single('audio'), async function (req, res) {

    const audioFormat = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']

    if (!audioFormat.includes(req.file.mimetype)) {
        res.status(500).json({ error: 'file harus format audio/mpeg, audio/mp3, audio/wav, audio/ogg' })
        exit();
    }

    const audio = imageToGenerativePart(req.file.path, req.file.mimetype);
    console.log(req.file.mimetype);

    // console.log('audio', audio);
    // return false
    try {
        console.log('success');

        const response = await gemini_generate([{ text: 'Transcribe or analyze the following audio' }, audio])

        res.json({ output: response })
        console.log('response', response);
    } catch (error) {
        console.log('error');
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }


})

module.exports = router;
