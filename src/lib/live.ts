import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class LiveSession {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  
  // Audio playback
  private playbackQueue: Float32Array[] = [];
  private isPlaying = false;
  private nextPlayTime = 0;

  constructor(
    private onMessage: (text: string) => void,
    private onThinking: (text: string) => void,
    private onError: (err: any) => void,
    private onStateChange: (state: 'connecting' | 'connected' | 'disconnected') => void
  ) {}

  async connect() {
    this.onStateChange('connecting');
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            this.onStateChange('connected');
            this.startRecording();
          },
          onmessage: async (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  this.playAudio(part.inlineData.data);
                }
                if (part.text) {
                  this.onMessage(part.text);
                }
              }
            }

            if (message.serverContent?.interrupted) {
              this.stopPlayback();
            }
          },
          onerror: (err) => {
            this.onError(err);
            this.disconnect();
          },
          onclose: () => {
            this.disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are a helpful Tax Assistant. You help users with tax calculations and questions.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });
    } catch (err) {
      this.onError(err);
      this.onStateChange('disconnected');
    }
  }

  private async startRecording() {
    if (!this.audioContext || !this.mediaStream || !this.sessionPromise) return;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
      // Convert to base64
      const buffer = new ArrayBuffer(pcm16.length * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < pcm16.length; i++) {
        view.setInt16(i * 2, pcm16[i], true); // little endian
      }
      
      const uint8Array = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);
      
      this.sessionPromise?.then(session => {
        session.sendRealtimeInput({
          audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
        });
      });
    };
    
    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private playAudio(base64: string) {
    if (!this.audioContext) return;
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // The audio is 24kHz PCM 16-bit
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 0x8000;
    }
    
    const buffer = this.audioContext.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    
    if (this.nextPlayTime < this.audioContext.currentTime) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    
    source.start(this.nextPlayTime);
    this.nextPlayTime += buffer.duration;
  }

  private stopPlayback() {
    this.nextPlayTime = this.audioContext?.currentTime || 0;
    // Note: We can't easily stop already scheduled nodes without keeping track of them,
    // but for simplicity we just reset the nextPlayTime.
  }

  disconnect() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.sessionPromise) {
      this.sessionPromise.then(session => session.close());
      this.sessionPromise = null;
    }
    this.onStateChange('disconnected');
  }
}
