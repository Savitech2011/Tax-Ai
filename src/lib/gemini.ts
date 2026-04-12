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
      systemInstruction: "You are an expert tax assistant. You must ONLY respond to tax-related tasks and questions. If a user asks about anything else, politely decline and remind them that you are a specialized tax AI. Keep your responses concise and within reasonable length."
    }
  });
  return response.text;
}

export async function callMaxAgent(messages: ChatMessage[], mode: AgentMode) {
  return await callGemini(messages, mode);
}

export async function sendMessageStream(
  messages: ChatMessage[],
  mode: AgentMode,
  model: string,
  isAutoMode: boolean,
  onChunk: (text: string) => void
) {
  let result: string;
  if (isAutoMode || model.startsWith('gemini')) {
    result = await callGemini(messages, mode) || '';
  } else {
    result = await callMaxAgent(messages, mode);
  }
  
  onChunk(result);
  return result;
}
