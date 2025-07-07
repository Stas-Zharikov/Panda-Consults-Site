import React, { useState } from 'react';
import axios from 'axios';

export default function WhispersPrototype() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    const res = await axios.post('/api/story', { prompt });
    setAudioUrl(res.data.audioUrl);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Whispers: Erotic AI Storyteller</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{ width: '100%' }} />
      <button onClick={generateStory}>Generate</button>
      {loading && <p>Generating...</p>}
      {audioUrl && <audio controls src={audioUrl} autoPlay />}
    </div>
  );
}