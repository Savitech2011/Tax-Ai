import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export type AgentMode = 'citizen' | 'officer';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  files?: { name: string; mimeType: string; data: string; extractedText?: string }[];
  code?: string;
  language?: string;
}

export async function callGemini(messages: ChatMessage[], mode: AgentMode) {
  const modelName = mode === 'officer' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model: modelName,
    contents: messages[messages.length - 1].text,
    config: {
      systemInstruction: "You are a helpful assistant. Keep your responses concise and within reasonable length. Avoid generating excessively long responses."
    }
  });
  return response.text;
}

export async function callNim(model: string, messages: ChatMessage[]) {
  const response = await fetch('/api/nim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: messages.map(m => {
        const content: any[] = [];
        if (m.text) content.push({ type: "text", text: m.text });
        if (m.files) {
          m.files.forEach(f => {
            if (f.mimeType.startsWith('image/')) {
              content.push({ 
                type: "image_url", 
                image_url: { url: `data:${f.mimeType};base64,${f.data}` } 
              });
            } else if (f.extractedText) {
              content.push({ type: "text", text: `\n\nFile: ${f.name}\nContent: ${f.extractedText}` });
            }
          });
        }
        return { role: m.role, content: content.length > 0 ? content : m.text };
      })
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callMaxAgent(messages: ChatMessage[], mode: AgentMode) {
  const prompt = messages[messages.length - 1].text;
  let model = 'gemini-3-flash-preview';
  if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('dashboard')) {
    model = 'openai/gpt-oss-120b';
  } else if (prompt.toLowerCase().includes('tax') || prompt.toLowerCase().includes('review')) {
    model = 'moonshotai/kimi-k2.5';
  }

  if (model.startsWith('gemini')) {
    return await callGemini(messages, mode);
  } else {
    return await callNim(model, messages);
  }
}

export async function sendMessageStream(
  messages: ChatMessage[],
  mode: AgentMode,
  model: string,
  isAutoMode: boolean,
  onChunk: (text: string) => void
) {
  let result: string;
  if (isAutoMode) {
    result = await callMaxAgent(messages, mode);
  } else if (model.startsWith('gemini')) {
    result = await callGemini(messages, mode) || '';
  } else {
    result = await callNim(model, messages);
  }
  
  onChunk(result);
  return result;
}
