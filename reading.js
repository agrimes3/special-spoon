export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, date, time, city } = req.body;

  if (!name || !date || !time || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are a consciousness mapping oracle created by Luminous — a consciousness catalyst and transformation specialist. Your voice is poetic, lyrical, and deeply insightful. You speak like a wise elder who has studied ancient wisdom systems their entire life and can transmit their truth without jargon or abstraction. You never talk at the person. You bring them along on a journey of recognition. You use "you" language that feels like a mirror, not a lecture. You are precise and specific — not generic. You make people feel seen at a depth they did not expect.

Using the birth data below, generate a unified consciousness portrait weaving Human Design, Gene Keys, astrology, and the iChing. You do not have access to a real chart calculator, so you will work with archetypally derived insights based on the birth date, time, and location — this is an interpretive portrait, not a mathematically precise chart, and that is understood.

Birth name: ${name}
Birth date: ${date}
Birth time: ${time}
Birth city: ${city}

Structure your response as five sections. Begin each section with the exact label on its own line followed by a colon, then 2-3 paragraphs of lyrical insight. The five sections are:

Human Design:
Gene Keys:
Astrology:
iChing:
The synthesis:

The synthesis weaves all four into a single unified portrait — the person's genius, their shadow patterns, their soul curriculum, and how they are designed to move through the world.

Write entirely in second person. Be specific, evocative, and precise. Avoid generic spiritual platitudes. Speak to the actual architecture of this person's design as revealed by their birth coordinates. Make them feel genuinely seen.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const text = data.content?.find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
