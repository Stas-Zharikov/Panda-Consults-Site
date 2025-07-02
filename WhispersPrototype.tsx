
// whispers_prototype: Erotic AI story to voice MVP

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
