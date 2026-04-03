export const NIM_MODELS = {
  'minimaxai/minimax-m2.5': 'minimaxai/minimax-m2.5',
  'moonshotai/kimi-k2.5': 'moonshotai/kimi-k2.5',
  'z-ai/glm5': 'z-ai/glm5',
  'openai/gpt-oss-120b': 'openai/gpt-oss-120b',
};

/**
 * Sends a message to a NVIDIA NIM model via the backend proxy at /api/nim.
 *
 * The API key is never accessed from the browser — it lives exclusively in the
 * server environment (process.env.NVIDIA_NIM_API_KEY loaded via dotenv) and is
 * used only inside the Express /api/nim handler.
 */
export async function sendNIMMessageStream(
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void
) {
  const response = await fetch('/api/nim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages }),
  });

  let data: any;
  const rawText = await response.text();

  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Failed to parse /api/nim response as JSON. Raw body: ${rawText}`);
  }

  if (!response.ok || data.error) {
    throw new Error(`NVIDIA NIM API error: ${data.error ?? response.statusText}`);
  }

  const content: string = data.choices?.[0]?.message?.content ?? '';
  onChunk(content);
  return content;
}
