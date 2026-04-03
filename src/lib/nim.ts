export const NIM_MODELS = {
  'minimaxai/minimax-m2.5': 'minimaxai/minimax-m2.5',
  'moonshotai/kimi-k2.5': 'moonshotai/kimi-k2.5',
  'z-ai/glm5': 'z-ai/glm5',
  'openai/gpt-oss-120b': 'openai/gpt-oss-120b',
};

export async function sendNIMMessageStream(
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void
) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_NIM_API_KEY is missing.");
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA NIM API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            fullText += content;
            onChunk(fullText);
          } catch (e) {
            console.error('Error parsing JSON', e);
          }
        }
      }
    }
  }
  return fullText;
}
