// test-groq.js
require('dotenv').config({ path: '.env.local' });
const { Groq } = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function main() {
    console.log("Testing Groq API...");
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "Respond with a valid JSON object containing a single key 'status' with the value 'Groq is operational'. Use JSON mode."
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        console.log("Groq Response:", chatCompletion.choices[0]?.message?.content);
    } catch (err) {
        console.error("Groq Error:", err.message);
    }
}

main();
