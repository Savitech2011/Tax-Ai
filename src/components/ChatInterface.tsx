import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';
import { AgentMode, ChatMessage, sendMessageStream } from '../lib/gemini';
import { LiveSession } from '../lib/live';
import { VoiceFace } from './VoiceFace';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ChevronLeft, Sparkles, Maximize2, FileText, Code, ChevronDown, Paperclip, Mic, MicOff, Map, ArrowUp, Loader2, X, Play, Copy, ThumbsUp, ThumbsDown, Download, MoreHorizontal } from 'lucide-react';

const AgentFace = ({ isActive }: { isActive: boolean }) => {
  const lookAnimation: any = {
    x: [0, 2, -2, 0, 1, -1, 0],
    y: [0, -2, 1, -1, 2, 0, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const blinkAnimation: any = {
    scaleY: [1, 1, 1, 0.1, 1, 1, 1, 1, 1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  };

  return (
    <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#2563eb] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center shrink-0">
      <motion.div 
        animate={isActive ? lookAnimation : { x: 0, y: 0 }}
        className="flex gap-[3px]"
      >
        <motion.div 
          animate={blinkAnimation}
          className="w-1 h-1.5 bg-white rounded-full" 
        />
        <motion.div 
          animate={blinkAnimation}
          className="w-1 h-1.5 bg-white rounded-full" 
        />
      </motion.div>
    </div>
  );
};

const ThinkingAnimation = () => {
  const [text, setText] = useState("Planning next steps");
  
  useEffect(() => {
    const states = ["Analyzing tax data", "Reviewing guidelines", "Planning next steps", "Formulating response"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % states.length;
      setText(states[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-center gap-3 py-1"
    >
      <motion.span
        animate={{ backgroundPosition: ["200% center", "-200% center"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        className="text-[15px] font-medium tracking-wide"
        style={{
          backgroundImage: "linear-gradient(90deg, #9ca3af 0%, #111827 50%, #9ca3af 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

const MessageActions = ({ text }: { text: string }) => {
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const readAloud = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-3 mt-4 text-gray-400">
      <button onClick={copyToClipboard} className="hover:text-gray-600 transition-colors p-1" title="Copy"><Copy className="w-4 h-4" /></button>
      <button onClick={() => setIsLiked(true)} className={cn("hover:text-gray-600 transition-colors p-1", isLiked === true ? "text-purple-600" : "")} title="Like"><ThumbsUp className="w-4 h-4" /></button>
      <button onClick={() => setIsLiked(false)} className={cn("hover:text-gray-600 transition-colors p-1", isLiked === false ? "text-purple-600" : "")} title="Dislike"><ThumbsDown className="w-4 h-4" /></button>
      <button onClick={downloadText} className="hover:text-gray-600 transition-colors p-1" title="Download"><Download className="w-4 h-4" /></button>
      <button onClick={readAloud} className="hover:text-gray-600 transition-colors p-1" title="Read Aloud"><MoreHorizontal className="w-4 h-4" /></button>
    </div>
  );
};

export default function ChatInterface({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<AgentMode>('citizen');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');

  const models = [
    { name: 'Gemini Flash', id: 'gemini-3-flash-preview' },
    { name: 'Gemini Pro', id: 'gemini-3.1-pro-preview' },
    { name: 'Minimax m2.5', id: 'minimaxai/minimax-m2.5' },
    { name: 'Kimi k2.5', id: 'moonshotai/kimi-k2.5' },
    { name: 'GLM 5', id: 'z-ai/glm5' },
    { name: 'GPT oss 120b', id: 'openai/gpt-oss-120b' },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [files, setFiles] = useState<{ name: string; mimeType: string; data: string; extractedText?: string }[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const [showPreview, setShowPreview] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showVoiceFace, setShowVoiceFace] = useState(false);
  const [voiceState, setVoiceState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const liveSessionRef = useRef<LiveSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVoiceMode) {
      setShowVoiceFace(true);
      if (voiceState === 'disconnected') {
        liveSessionRef.current = new LiveSession(
          (text) => {
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'model') {
                return [...prev.slice(0, -1), { ...last, text: last.text + text }];
              }
              return [...prev, { id: Date.now().toString(), role: 'model', text }];
            });
          },
          (thinking) => {},
          (err) => console.error("Live API Error:", err),
          (state) => setVoiceState(state)
        );
        liveSessionRef.current.connect();
      }
    } else {
      setShowVoiceFace(false);
      if (liveSessionRef.current) {
        liveSessionRef.current.disconnect();
        liveSessionRef.current = null;
      }
    }
  }, [isVoiceMode]);

  useEffect(() => {
    return () => {
      if (liveSessionRef.current) {
        liveSessionRef.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const processedFiles = await Promise.all(
        newFiles.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
          let binary = '';
          for (let i = 0; i < uint8Array.byteLength; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64 = btoa(binary);

          let extractedText = '';
          if (file.name.endsWith('.docx')) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: buffer });
              extractedText = result.value;
            } catch (err) {
              console.error("Error extracting text from docx:", err);
            }
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            try {
              const workbook = XLSX.read(buffer, { type: 'array' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              extractedText = XLSX.utils.sheet_to_csv(worksheet);
            } catch (err) {
              console.error("Error extracting text from xlsx:", err);
            }
          }

          return { 
            name: file.name, 
            mimeType: file.type || 'application/octet-stream', 
            data: base64,
            extractedText: extractedText || undefined
          };
        })
      );
      setFiles((prev) => [...prev, ...processedFiles]);
    }
  };

  const extractCode = (text: string) => {
    const match = text.match(/```(\w+)?\n([\s\S]*?)```/);
    if (match) {
      return { language: match[1] || 'javascript', code: match[2] };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      files: files.length > 0 ? files.map(({ name, mimeType, data, extractedText }) => ({ name, mimeType, data, extractedText })) : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setFiles([]);
    setIsStreaming(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: modelMsgId, role: 'model', text: '' },
    ]);

    try {
      await sendMessageStream([...messages, userMsg], mode, selectedModel, isAutoMode, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === modelMsgId) {
              const extracted = extractCode(chunk);
              if (extracted) {
                setActiveCode(extracted.code);
                setActiveLanguage(extracted.language);
                setIsWorkspaceOpen(true);
              }
              return { ...msg, text: chunk };
            }
            return msg;
          })
        );
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      let errorMessage = 'Sorry, I encountered an error processing your request. Please check your connection or try again later.';
      
      if (error?.message) {
        errorMessage += ` (Error: ${error.message})`;
      }
      
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === modelMsgId) {
            return { ...msg, text: errorMessage };
          }
          return msg;
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] text-gray-900 font-sans selection:bg-purple-200">
      <AnimatePresence>
        {showVoiceFace && (
          <div className="absolute inset-0 z-50 bg-[#f4f5f7]">
            <VoiceFace onClose={() => setIsVoiceMode(false)} />
          </div>
        )}
      </AnimatePresence>

      {!showVoiceFace && (
        <>
          {/* Main Chat Area */}
          <div className={cn("flex flex-col relative transition-all duration-300", (activeCode && isWorkspaceOpen) ? "w-1/2 border-r border-gray-200" : "w-full")}>
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-[#f4f5f7]/80 backdrop-blur-sm z-10 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  TaxAI
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <input 
                    type="checkbox" 
                    checked={isAutoMode} 
                    onChange={(e) => setIsAutoMode(e.target.checked)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Auto Mode</span>
                </div>
                {isAutoMode ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Max Agent
                  </div>
                ) : (
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                )}
                {activeCode && !isWorkspaceOpen && (
                  <button 
                    onClick={() => setIsWorkspaceOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border bg-purple-600 border-purple-500 text-white hover:bg-purple-700 shadow-md shadow-purple-200 animate-in fade-in zoom-in duration-300"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Open Workspace
                  </button>
                )}
                <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setMode('citizen')}
                    className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors", mode === 'citizen' ? "bg-black text-white" : "text-gray-500 hover:text-gray-800")}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => setMode('officer')}
                    className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors", mode === 'officer' ? "bg-black text-white" : "text-gray-500 hover:text-gray-800")}
                  >
                    Officer
                  </button>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-8">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-medium text-gray-800 mb-2">How can I help you today?</h2>
                  <p className="text-sm max-w-md text-center text-gray-500">
                    {mode === 'citizen' 
                      ? "Ask me about tax brackets, deductions, or upload your forms for review."
                      : "Upload complex datasets, ask for custom calculators, or request deep legal analysis."}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex w-full max-w-4xl mx-auto", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    {msg.role === 'user' ? (
                      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3.5 max-w-[70%] text-gray-800 text-[15px] leading-relaxed">
                        {msg.files && msg.files.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {msg.files.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-100">
                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                <span className="truncate max-w-[150px] text-gray-700">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <AgentFace isActive={isStreaming && msg.id === messages[messages.length - 1].id} />
                          <span className="font-medium text-sm text-gray-900">TaxAI</span>
                        </div>
                        
                        <div className="pl-8">
                          {(() => {
                            const hasThink = msg.text.includes('<think>');
                            const isThinking = isStreaming && msg.id === messages[messages.length - 1].id && (hasThink ? !msg.text.includes('</think>') : !msg.text.trim());
                            const content = msg.text.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();
                            
                            return (
                              <div className="flex flex-col gap-2">
                                <AnimatePresence mode="wait">
                                  {isThinking && (
                                    <ThinkingAnimation key="thinking" />
                                  )}
                                </AnimatePresence>

                                {content && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-sm max-w-none prose-neutral text-[15px] leading-relaxed text-gray-800"
                                  >
                                    <ReactMarkdown
                                      components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                          const match = /language-(\w+)/.exec(className || '');
                                          if (!inline && match) {
                                            return (
                                              <details className="group my-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                                <summary className="flex items-center justify-between px-4 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                                                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                                    <Code className="w-3.5 h-3.5 text-purple-600" />
                                                    <span>{match[1].toUpperCase()} CODE</span>
                                                  </div>
                                                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                                                </summary>
                                                <div className="border-t border-gray-100">
                                                  <pre className={cn(className, "m-0 p-4 overflow-x-auto bg-white text-[13px] font-mono text-gray-800")} {...props}>
                                                    {children}
                                                  </pre>
                                                </div>
                                              </details>
                                            );
                                          }
                                          return <code className={cn(className, "bg-gray-100 px-1.5 py-0.5 rounded text-purple-600 font-medium")} {...props}>{children}</code>;
                                        }
                                      }}
                                    >
                                      {content}
                                    </ReactMarkdown>
                                    {msg.role === 'model' && (!isStreaming || msg.id !== messages[messages.length - 1].id) && (
                                      <MessageActions text={content} />
                                    )}
                                  </motion.div>
                                )}
                                
                                {!isStreaming && hasThink && (
                                  <details className="group mt-1">
                                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none transition-colors">View reasoning</summary>
                                    <div className="mt-2 p-3 bg-white/50 rounded-xl text-xs text-gray-500 font-mono whitespace-pre-wrap border border-gray-200/60 shadow-sm max-h-48 overflow-y-auto">
                                      {msg.text.match(/<think>([\s\S]*?)(?:<\/think>|$)/)?.[1]?.trim() || "Thinking process..."}
                                    </div>
                                  </details>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Floating Input */}
            <div className="absolute bottom-8 left-0 right-0 px-6 flex justify-center pointer-events-none">
              <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/60 p-3 pointer-events-auto flex flex-col transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:border-gray-300">
                {files.length > 0 && (
                  <div className="flex gap-2 mb-2 px-2 flex-wrap">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-100">
                        <FileText className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate max-w-[150px] text-gray-700">{f.name}</span>
                        <button onClick={() => setFiles(files.filter((_, index) => index !== i))} className="text-gray-400 hover:text-red-500 ml-1">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={mode === 'citizen' ? "Plan, search, or ask a tax question..." : "Describe the tool or analysis you need..."}
                  className="w-full max-h-48 min-h-[60px] bg-transparent border-0 focus:ring-0 resize-none py-2 px-3 text-gray-900 placeholder:text-gray-400 text-[15px] leading-relaxed outline-none"
                  rows={1}
                />
                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-1">
                    <label className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer rounded-full hover:bg-gray-50 transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    <button 
                      onClick={() => setIsVoiceMode(!isVoiceMode)}
                      className={cn("p-2 rounded-full transition-colors flex items-center gap-2", isVoiceMode ? "text-purple-600 bg-purple-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}
                      title={voiceState === 'connecting' ? "Connecting..." : voiceState === 'connected' ? "Voice Active" : "Enable Voice"}
                    >
                      {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      {isVoiceMode && <span className="text-xs font-medium">{voiceState === 'connecting' ? 'Connecting...' : 'Active'}</span>}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors">
                      <Map className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={isStreaming || (!input.trim() && files.length === 0)}
                      className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-colors"
                    >
                      {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
