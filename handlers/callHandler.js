


import fs from "fs";
import { textToSpeechDeepgram } from "../services/tts.js";
import { speechToText } from "../services/stt.js";

// const beep = fs.readFileSync("test.raw").toString("base64");

export function handleCall(ws) {
  let audioChunks = [];
  let chunkCount = 0;
  let isBotSpeaking = true;
  let speaking = false;
  let lastResponseTime = 0;

  ws.on("message", async (data) => {
    let msg;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    console.log("Event:", msg.event);

    // 🟢 CALL START
    if (msg.event === "start") {
      console.log("📞 Call started");

      // send beep
      // ws.send(JSON.stringify({
      //   event: "media",
      //   media: { payload: beep }
      // }));

      // greeting
      setTimeout(async () => {
        const greeting = await textToSpeechDeepgram(
            `Hi, welcome to Vibhum Software services ! 
I’m your virtual assistant, and I’ll be happy to help you today. 
How can I assist you?`
        );

        ws.send(JSON.stringify({
          event: "media",
          media: { payload: greeting }
        }));

        // allow listening after greeting
        setTimeout(() => {
          isBotSpeaking = false;
          console.log("🎤 Listening to user...");
        }, 2500);

      }, 500);
    }

    // 🟢 USER AUDIO
    if (msg.event === "media") {

      // ignore bot audio
      if (isBotSpeaking) return;

      const chunk = Buffer.from(msg.media.payload, "base64");
      audioChunks.push(chunk);
      chunkCount++;

      // detect speaking started
      if (chunkCount > 5) {
        speaking = true;
      }

      // process after enough chunks
      if (chunkCount > 40 && speaking) {
        console.log("🧠 Processing user speech...");

        const fullAudio = Buffer.concat(audioChunks);

        // reset
        audioChunks = [];
        chunkCount = 0;
        speaking = false;

        try {
          const text = await speechToText(fullAudio);
          console.log("👤 User:", text);

          // ❌ ignore empty speech
          if (!text || text.trim().length < 2) {
            console.log("⚠️ Ignoring empty speech");
            return;
          }

          // ⛔ prevent rapid repeat
          const now = Date.now();
          if (now - lastResponseTime < 3000) {
            console.log("⏳ Skipping repeated response");
            return;
          }

          lastResponseTime = now;

          const reply = "Thank you";

          // block listening while bot speaks
          isBotSpeaking = true;

          const audio = await textToSpeechDeepgram(reply);

          ws.send(JSON.stringify({
            event: "media",
            media: { payload: audio }
          }));

          // allow listening again after speaking
          setTimeout(() => {
            isBotSpeaking = false;
          }, 1500);

        } catch (err) {
          console.log("❌ pipeline error:", err.message);
        }
      }
    }
  });

  ws.on("close", () => {
    console.log("🔌 disconnected");
  });
}








 
// import fs from "fs";
// import { textToSpeechDeepgram } from "../services/tts.js";

// const audioBase64 = fs.readFileSync("test.raw").toString("base64");

// export function handleCall(ws) {
//   ws.on("message", async (data) => {
//     let msg;

//     try {
//       msg = JSON.parse(data.toString());
//     } catch {
//       return;
//     }

//     console.log("Event:", msg.event);

//     if (msg.event === "start") {
//       console.log("📞 Call started");

//       // ✅ 1. SEND INSTANT AUDIO (CRITICAL)
//       ws.send(JSON.stringify({
//         event: "media",
//         media: {
//           payload: audioBase64
//         }
//       }));

//       // ✅ 2. OPTIONAL: send real TTS AFTER delay
//       setTimeout(async () => {
//         try {
//           const audio = await textToSpeechDeepgram(
//             "Hello, welcome to Vibhum Software. How can I help you?"
//           );

//           ws.send(JSON.stringify({
//             event: "media",
//             media: {
//               payload: audio
//             }
//           }));
//         } catch (err) {
//           console.log("TTS error:", err.message);
//         }
//       }, 1000);
//     }
//   });

//   ws.on("close", () => {
//     console.log("🔌 disconnected");
//   });
// }




















// import fs from "fs";

// const audioBase64 = fs.readFileSync("test.raw").toString("base64");

// export function handleCall(ws) {
//   ws.on("message", (data) => {
//     let msg;

//     try {
//       msg = JSON.parse(data.toString());
//     } catch {
//       return;
//     }

//     console.log("Event:", msg.event);

//     if (msg.event === "start") {
//       console.log("📞 Call started");

//       // ⚡ send immediately
//       ws.send(JSON.stringify({
//         event: "media",
//         media: {
//           payload: audioBase64
//         }
//       }));
//     }
//   });

//   ws.on("close", () => {
//     console.log("🔌 disconnected");
//   });
// }