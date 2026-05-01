import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function getAIResponse(text) {
//   const res = await openai.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [
//       { role: "system", content: "You are a helpful voice assistant for Vibhum Software." },
//       { role: "user", content: text }
//     ]
//   });

//   return res.choices[0].message.content;
return "Thank you for calling Vibhum Software. Our team will assist you.";

}