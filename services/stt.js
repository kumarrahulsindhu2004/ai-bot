import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import { spawn } from "child_process";

// 🔥 convert mulaw → linear16
function convertMulawToLinear16(buffer) {
  return new Promise((resolve, reject) => {
    // const { spawn } = require("child_process");

    const ffmpeg = spawn("ffmpeg", [
      "-f", "mulaw",      // ✅ INPUT FORMAT (VERY IMPORTANT)
      "-ar", "8000",      // sample rate
      "-ac", "1",         // mono
      "-i", "pipe:0",     // input from buffer
      "-f", "s16le",      // output format
      //  "-af", "silenceremove=1:0:-30dB", // 🔥 REMOVE SILENCE

      "-ar", "8000",
      "-ac", "1",
      "pipe:1"
    ]);

    const chunks = [];

    ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
    ffmpeg.stderr.on("data", (err) => console.log("ffmpeg:", err.toString()));

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error("FFmpeg failed"));
      }
      resolve(Buffer.concat(chunks));
    });

    ffmpeg.stdin.write(buffer);
    ffmpeg.stdin.end();
  });
}

export async function speechToText(audioBuffer) {
  try {
    // ✅ CONVERT AUDIO FIRST
    const pcmAudio = await convertMulawToLinear16(audioBuffer);

    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      pcmAudio,
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/linear16" // ✅ FIXED
        },
        params: {
          encoding: "linear16",   // ✅ FIXED
          sample_rate: 8000,
          channels: 1,
          model: "nova-2",
          punctuate: true
        }
      }
    );

    return response.data.results.channels[0].alternatives[0].transcript || "";

  } catch (err) {
    console.log("STT error:", err.response?.data || err.message);
    return "";
  }
}