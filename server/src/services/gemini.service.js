// const MODEL = "meta-llama/llama-3.1-8b-instruct";

import openRouter from "../config/openrouter.js";

export const generateAIItinerary = async (data) => {
    const response = await openRouter.post("/chat/completions", {
        model: "meta-llama/llama-3.1-8b-instruct",
        temperature: 0.2,
        messages: [
            {
                role: "system",
                content: `
You are a strict JSON generator.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanation
- If data is missing, use "unknown"
- Do NOT guess random values
`
            },
            {
                role: "user",
                content: `
Extract travel itinerary from this booking:

${data}

Return format:
{
  "title": "string",
  "flight": {
    "departure": "string",
    "arrival": "string",
    "date": "string",
    "time": "string"
  },
  "hotel": {
    "name": "string",
    "address": "string"
  },
  "summary": "string",
  "confidence": number
}
`
            }
        ]
    });

    let text = response.data.choices[0].message.content;

    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
};