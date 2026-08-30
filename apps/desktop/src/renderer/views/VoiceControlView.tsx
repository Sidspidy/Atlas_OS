import React, { useEffect, useState, useRef } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Mic, MicOff, Volume2, Radio, Sliders, Play, Square, Sparkles } from 'lucide-react';
import { AudioWaveformVisualizer } from '../components/AudioWaveformVisualizer.js';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const VoiceControlView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [transcript, setTranscript] = useState<string>('');
  const [speechResponse, setSpeechResponse] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.1);

  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
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
          setTranscript(currentText);
          lastTranscriptRef.current = currentText;
        }
      };

      rec.onend = () => {
        setIsListening(false);
        const finalQuery = lastTranscriptRef.current;
        if (finalQuery.trim()) {
          handleProcessQuery(finalQuery);
        } else {
          if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
        }
      };

      rec.onerror = (err: any) => {
        console.warn('[VoiceControl] Speech recognition error:', err);
        setIsListening(false);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      };

      recognitionRef.current = rec;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    lastTranscriptRef.current = '';
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.LISTENING);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('[VoiceControl] Speech recognition restart:', e);
      }
    } else {
      // Fallback demo text if browser lacks microphone hardware API
      setTimeout(() => {
        handleProcessQuery('open file explorer');
      }, 2500);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.THINKING);
    setTranscript(queryText);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      const responseText = data.message?.text || 'Atlas Voice Assistant operational.';
      setSpeechResponse(responseText);

      // Speak response back with Cute Anime Kid Female Voice
      setIsSpeaking(true);
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SPEAKING);
      speakCuteAnimeVoice(responseText, speechRate);
    } catch (e) {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Voice System & Speech Pipeline</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Speech-to-Text command engine with Cute Anime Kid Female AI Vocal Synthesis
          </p>
        </div>

        {/* Wake Word Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Wake Word "Hey Atlas":</span>
          <button
            onClick={() => setWakeWordActive(!wakeWordActive)}
            style={{
              background: wakeWordActive ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-secondary)',
              border: wakeWordActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
              color: wakeWordActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} color={wakeWordActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
            {wakeWordActive ? 'Listening Active' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Audio Waveform Canvas Visualizer */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
            Real-time Audio Spectrum ({isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Idle'})
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Cute Anime Kid Female Voice Pipeline</span>
        </div>
        <AudioWaveformVisualizer isListening={isListening} isSpeaking={isSpeaking} />
      </GlassPanel>

      {/* Push-To-Talk Mic Hero Button */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px', gap: '16px' }}>
        <button
          onClick={toggleListening}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: isListening
              ? 'linear-gradient(135deg, #ef4444, #f97316)'
              : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            border: 'none',
            boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : 'var(--shadow-glass), var(--glow-cyan)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {isListening ? <MicOff size={36} /> : <Mic size={36} />}
        </button>

        <div style={{ fontSize: '15px', fontWeight: 600, color: isListening ? 'var(--accent-red)' : 'var(--text-main)' }}>
          {isListening ? 'Listening to Microphone... (Click to finish & execute)' : 'Click Microphone or Press Spacebar for Voice Input'}
        </div>

        {transcript && (
          <div style={{ fontSize: '14px', color: 'var(--accent-cyan)', background: 'var(--bg-secondary)', padding: '10px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            🎙️ Transcribed Speech: "{transcript}"
          </div>
        )}
      </GlassPanel>

      {/* Vocal Playback Controls */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-purple)" />
          Cute Anime Kid Female AI Vocal Tuning (Pitch 1.65x)
        </div>

        {speechResponse && (
          <div style={{ fontSize: '14px', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            🗣️ Response: {speechResponse}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Sliders size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Speech Speed: {speechRate}x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {isSpeaking ? (
              <Button variant="default" onClick={stopSpeaking}>
                <Square size={14} color="var(--accent-red)" /> Interrupt Speech
              </Button>
            ) : (
              <Button variant="primary" onClick={() => speakCuteAnimeVoice(speechResponse || 'Hello master! I am Atlas! How can I help you today?', speechRate)}>
                <Play size={14} /> Speak (Cute Anime Kid Voice)
              </Button>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
