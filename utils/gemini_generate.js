var dotenv = require('dotenv');
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

console.log(process.env.GEMINI_API_KEY);

async function gemini_generate(prompt) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
    });
    return response.text;
    // console.log(response.text);
}


module.exports = {
    gemini_generate
}