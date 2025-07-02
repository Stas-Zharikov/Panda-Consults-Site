// whispers_prototype: Erotic AI story to voice MVP

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function WhispersPrototype() {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAudioUrl("");
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      console.error("Error generating story:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-serif text-center">Whispers AI</h1>
      <p className="text-muted-foreground text-center">
        Describe your fantasy, and let the AI whisper it to you.
      </p>
      <Textarea
        rows={5}
        placeholder="Tonight I want to hear a story about..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? "Generating..." : "Whisper it to me"}
      </Button>
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}

// /pages/api/story.ts (or .js) — backend route for generating story + voice

// Required: Add your API keys to environment variables
// OPENAI_API_KEY and ELEVENLABS_API_KEY

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
    // 1. Generate erotic story from GPT
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

    // 2. Send to ElevenLabs
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
