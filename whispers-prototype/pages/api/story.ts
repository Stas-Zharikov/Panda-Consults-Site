export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an erotic storyteller. Write short, immersive, sensual stories in the second person. Keep it around 300 words. Avoid illegal content or non-consensual scenarios.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      }),
    });

    const gptData = await gptRes.json();
    const story = gptData.choices?.[0]?.message?.content || "";

    const voiceRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: story,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!voiceRes.ok) throw new Error("TTS failed");

    const buffer = await voiceRes.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
