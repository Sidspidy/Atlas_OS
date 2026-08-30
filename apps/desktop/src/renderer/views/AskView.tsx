import React, { useState, useRef } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AIChatMessage } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

interface AskViewProps {
  initialPrompt?: string;
}

export const AskView: React.FC<AskViewProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'atlas',
      text: 'Hello! I am Atlas, your desktop AI companion. Ask me anything, inspect local files, or run system commands!',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>('');

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: AIChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.THINKING);

    try {
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });

      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.WORKING);
      const data = await response.json();

      if (data.success && data.message) {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SPEAKING);
        setMessages((prev) => [...prev, data.message]);

        // Speak back response with Cute Anime Kid Voice
        speakCuteAnimeVoice(data.message.text);
      }
    } catch (e) {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMicListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      handleSend('what is next JS');
      return;
    }

    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (lastTranscriptRef.current.trim()) {
        handleSend(lastTranscriptRef.current);
      }
    } else {
      setIsListening(true);
      lastTranscriptRef.current = '';
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.LISTENING);

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText.trim()) {
          setInput(currentText);
          lastTranscriptRef.current = currentText;
        }
      };

      rec.onend = () => {
        setIsListening(false);
        const finalQuery = lastTranscriptRef.current;
        if (finalQuery.trim()) {
          handleSend(finalQuery);
        } else {
          if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      };

      recognitionRef.current = rec;
      try {
        rec.start();
      } catch (e) {}
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Chat Assistant & Voice Command</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Interactive AI workspace with direct local file access & cute anime kid voice
          </p>
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <GlassPanel style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', marginBottom: '16px' }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%'
              }}
            >
              {/* Avatar Icon */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isUser ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'linear-gradient(135deg, #a855f7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isUser ? '0 0 10px rgba(56, 189, 248, 0.4)' : '0 0 10px rgba(168, 85, 247, 0.4)'
                }}
              >
                {isUser ? <User size={20} color="#fff" /> : <Bot size={20} color="#fff" />}
              </div>

              {/* Message Text Bubble */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  alignItems: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: isUser ? '#38bdf8' : '#a855f7' }}>
                    {isUser ? 'You' : 'Atlas Assistant'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{msg.timestamp}</span>
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    background: isUser
                      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.04)',
                    padding: '14px 18px',
                    borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    border: isUser ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                    cursor: 'text',
                    whiteSpace: 'pre-wrap',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </GlassPanel>

      {/* Input Box with Push-to-Talk Voice Mic */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={toggleMicListening}
          style={{
            background: isListening ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.15)',
            border: isListening ? '1px solid #ef4444' : '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '12px',
            width: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isListening ? '#ef4444' : '#a855f7',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.6)' : 'none'
          }}
          title="Push to talk voice input"
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Atlas about your codebase, files, memory, or run tools..."
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 18px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
        />

        <Button variant="primary" onClick={() => handleSend()} disabled={isProcessing}>
          <Send size={16} /> Send
        </Button>
      </div>
    </div>
  );
};
