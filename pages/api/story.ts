import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  const openaiRes = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const story = openaiRes.data.choices[0].message.content;

  const voiceRes = await axios.post(
    'https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID/stream',
    {
      text: story,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.4, similarity_boost: 0.75 },
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    }
  );

  const audioBase64 = Buffer.from(voiceRes.data, 'binary').toString('base64');
  const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

  res.status(200).json({ audioUrl });
}