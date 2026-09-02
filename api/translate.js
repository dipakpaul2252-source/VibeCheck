// Vercel Serverless Function: Real-Time Gen Z Cultural AI Translator
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, intensity = 3, subculture = 'universal', direction = 'to_genz', communitySlang = [] } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "text" in request body' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'mock-openai-key') {
    return res.status(200).json({
      error: 'OPENAI_API_KEY not configured on server',
      fallback: true
    });
  }

  const slangContext = communitySlang.map(s => `- "${s.term}": ${s.meaning} (Context: ${s.subculture || 'universal'})`).join('\n');

  const systemPrompt = `You are an elite, cynical, hyper-fluent Gen Z & Brainrot cultural linguist.
Translate the user's text into high-velocity internet vernacular at Brainrot Level ${intensity}/5 using the ${subculture} lens.

${slangContext ? `ACTIVE COMMUNITY CROWDSOURCED SLANG FROM DATABASE:\n${slangContext}\n` : ''}

TRANSLATION RULES:
1. Level 1 (Casual): Mild, natural slang (lowkey, bet, hits different, valid).
2. Level 2 (Social): Mainstream discourse (delulu, side-eye, rent-free, cap).
3. Level 3 (Hyper-Online): Extreme viral slang (lock in, cooked, crashout, aura points, let him cook).
4. Level 4 (High Irony): Meta-irony (mewing streak, mogging, copium, caught in 4k).
5. Level 5 (Terminal Brainrot): Pure surreal absurdism (skibidi, fanum tax, ohio rizz, level 10 gyatt, sigma).

OUTPUT FORMAT: Return strictly a valid JSON object with keys:
{
  "translated_text": string,
  "cringe_score": number (0-100),
  "detected_terms": string[],
  "why_funny_breakdown": string,
  "irony_layer": string,
  "workplace_safety": "Safe for Work" | "Casual Only" | "Instant HR Meeting"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Direction: ${direction}. Input Text: "${text}"` }
        ],
        temperature: 0.7 + (intensity * 0.05)
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenAI API Error: ${errText}`, fallback: true });
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message, fallback: true });
  }
}
