// import axios from "axios";
// import ffmpeg from "fluent-ffmpeg";
// import { Readable } from "stream";


// export async function textToSpeechDeepgram(text) {
//   const response = await axios.post(
//     "https://api.deepgram.com/v1/speak",
//     {
//       text: text
//     },
//     {
//       headers: {
//         Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       params: {
//         model: "aura-asteria-en",   // ✅ ADD THIS
//         encoding: "linear16",       // try forcing (still convert anyway)
//         sample_rate: 8000
//       },
//       responseType: "arraybuffer"
//     }
//   );

//   const inputBuffer = Buffer.from(response.data);

//   return new Promise((resolve, reject) => {
//     const stream = new Readable();
//     stream.push(inputBuffer);
//     stream.push(null);

//     const chunks = [];

//     ffmpeg(stream)
//       .audioFrequency(8000)
//       .audioChannels(1)
//       .format("s16le")
//       .on("error", reject)
//       .on("end", () => {
//         const output = Buffer.concat(chunks);
//         resolve(output.toString("base64"));
//       })
//       .pipe()
//       .on("data", (chunk) => chunks.push(chunk));
//   });
// }














import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

export async function textToSpeechDeepgram(text) {
  const response = await axios.post(
    "https://api.deepgram.com/v1/speak",
    { text },
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    }
  );

  const inputBuffer = Buffer.from(response.data);

  return new Promise((resolve, reject) => {
    const stream = new Readable();
    stream.push(inputBuffer);
    stream.push(null);

    const chunks = [];

    ffmpeg(stream)
      .audioFrequency(8000)
      .audioChannels(1)
      .format("s16le") // 🔥 REQUIRED
      .on("error", reject)
      .on("end", () => {
        const output = Buffer.concat(chunks);
        resolve(output.toString("base64"));
      })
      .pipe()
      .on("data", (chunk) => chunks.push(chunk));
  });
}







// export async function textToSpeechDeepgram(text) {
//   const response = await axios.post(
//     "https://api.deepgram.com/v1/speak",
//     { text },
//     {
//       headers: {
//         Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       params: {
//         model: "aura-asteria-en",
//         encoding: "linear16",   // ✅ required
//         sample_rate: 8000       // ✅ required
//       },
//       responseType: "arraybuffer"
//     }
//   );

//   return Buffer.from(response.data).toString("base64");
// }