
import { useState } from "react";

export default function WhispersPrototype() {
  const [prompt, setPrompt] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
    } catch (err) {
      console.error("Error fetching audio:", err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <textarea
        className="w-full p-2 text-black rounded mb-2"
        rows="4"
        placeholder="Describe your fantasy..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate & Play"}
      </button>
      {audioSrc && (
        <audio controls src={audioSrc} className="w-full mt-4">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
