import openRouter from "../config/openrouter.js";

export const generateAIItinerary = async (data) => {
    const response = await openRouter.post("/chat/completions", {
        model: "meta-llama/llama-3.1-8b-instruct",
        temperature: 0.1,
        messages: [
            {
                role: "system",
                content: `
You are an AI travel booking parser.

Your task:
Convert raw travel booking text into a clean structured itinerary JSON.

STRICT RULES:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add explanations.
- Do not add extra fields.
- Never guess information.
- If information is not present, return "unknown".
- Preserve original information from the booking.
- Extract only travel related details.

Confidence rules:
- 0.9-1.0 = all important details found
- 0.6-0.8 = some details missing
- below 0.5 = very incomplete booking

Date rules:
- Keep date exactly if available.
- Do not convert formats unless obvious.

Time rules:
- Keep original time format.

The JSON must follow this exact schema:
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
            },
            {
                role: "user",
                content: `
Parse this travel booking information:

----------------
${data}
----------------

Return the itinerary JSON only.
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