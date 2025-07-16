var express = require('express');
var router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// const { GoogleGenAI } = require("@google/genai");
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('chat', {
    title: 'Chat Bot',
    content: ''
  });
});

router.post('/store', async function (req, res, next) {

  let content = req.body.content;
  let errors = false;

  if (content.length === 0) {
    errors = true;

    // set flash message
    console.log('data kosong');

    // render to add.ejs with flash message
    res.render('chat', {
      content: content
    })
  }
  console.log(content);
  // return;

  // if no error
  if (!errors) {

    const result = await model.generateContent(content)
    const response = await result.response

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: content,
    // });

    res.json({ output: response.text() })
    console.log('response', response.text());
  }

})

module.exports = router;
