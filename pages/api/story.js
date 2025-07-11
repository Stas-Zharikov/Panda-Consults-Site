
import { Readable } from "stream";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body.prompt;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

  try {
    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a seductive storyteller. Keep it short, engaging, and erotic." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const story = openaiRes.data.choices[0].message.content;
    const voiceId = "Rachel";

    const audioRes = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: story,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.7
        }
      },
      {
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json"
        },
        responseType: "stream"
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    audioRes.data.pipe(res);
  } catch (error) {
    console.error("Error generating story or audio:", error.message);
    res.status(500).json({ error: "Failed to generate story/audio" });
  }
}
