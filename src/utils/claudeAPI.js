const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const hasClaudeKey = () => Boolean(API_KEY);

export async function getComplianceAdvice({ question, isCorrect, law, tip, career, subcategory }) {
  if (!API_KEY) return { text: tip, live: false };

  const systemPrompt = `You are Chidi — a friendly, encouraging Nigerian compliance expert inside a mobile learning game called ComplyNG. You speak like a smart, warm Nigerian mentor. Keep responses to 2-3 short sentences. No markdown, no lists, no hashtags. Speak directly to the learner.`;

  const userPrompt = isCorrect
    ? `A ${subcategory || career} just answered a compliance question about ${law} CORRECTLY. Question: "${question}". Give a brief, enthusiastic response that reinforces why this law matters to their specific career. Mention a real-world consequence of knowing this.`
    : `A ${subcategory || career} got a compliance question about ${law} WRONG. Question: "${question}". The key lesson is: ${tip}. Kindly correct them, explain the right answer in plain language, and mention a real fine or penalty they'd face if they violated this law in Nigeria.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 160,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (text) return { text, live: true };
  } catch (_) {}

  return { text: tip, live: false };
}

export async function getRegulatorInsight({ sector, weakestLaw, avgAccuracy }) {
  if (!API_KEY) return null;

  const prompt = `You are an AI advisor for Nigeria's compliance regulators (FIRS, CAC, NDPC).
Based on ComplyNG game data: ${sector} professionals have ${avgAccuracy}% accuracy on ${weakestLaw}.
In 3 sentences, write a policy recommendation for how regulators should address this knowledge gap.
Focus on practical, actionable steps. No markdown.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch (_) {
    return null;
  }
}
