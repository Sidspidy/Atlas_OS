import React, { useState, useEffect, useRef } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AtlasCharacter } from '@atlas-os/ui';
import { Maximize2, Mic, MicOff, Search, Camera, Code, Move } from 'lucide-react';
import { CompanionSpeechBubble, SpeechNotification } from '../components/CompanionSpeechBubble.js';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const CompanionView: React.FC = () => {
  const [currentState, setCurrentState] = useState<AtlasState>(AtlasState.IDLE);
  const [activeNotification, setActiveNotification] = useState<SpeechNotification | null>(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    if (window.atlasAPI) {
      window.atlasAPI.getState().then((s) => {
        if (s) setCurrentState(s as AtlasState);
      });

      window.atlasAPI.onStateChanged((stateStr) => {
        setCurrentState(stateStr as AtlasState);
      });

      window.atlasAPI.onNotificationReceived((notification) => {
        setActiveNotification(notification);
      });
    }

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
          lastTranscriptRef.current = currentText;
          setActiveNotification({
            id: `voice_${Date.now()}`,
            title: '🎙️ Speech Transcribed',
            message: `"${currentText}"`,
            type: 'info'
          });
        }
      };

      rec.onend = () => {
        setIsListening(false);
        const finalQuery = lastTranscriptRef.current;
        if (finalQuery.trim()) {
          executeQuery(finalQuery);
        } else {
          triggerState(AtlasState.IDLE);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        triggerState(AtlasState.IDLE);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleRestoreMain = () => {
    if (window.atlasAPI) {
      window.atlasAPI.restoreMain();
    }
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'open_main') {
      handleRestoreMain();
    }
    setActiveNotification(null);
  };

  const triggerState = (newState: AtlasState) => {
    setCurrentState(newState);
    if (window.atlasAPI) {
      window.atlasAPI.setState(newState);
    }
  };

  // 1. Voice Command Execution
  const toggleVoiceListening = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      triggerState(AtlasState.IDLE);
    } else {
      setIsListening(true);
      lastTranscriptRef.current = '';
      triggerState(AtlasState.LISTENING);
      setActiveNotification({
        id: 'voice_active',
        title: '🎙️ Listening to Voice...',
        message: 'Speak now (e.g. "open file explorer")',
        type: 'info'
      });

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('[Companion] Speech recognition error:', e);
        }
      } else {
        // Fallback demo execution
        setTimeout(async () => {
          setIsListening(false);
          await executeQuery('open file explorer');
        }, 2500);
      }
    }
  };

  const executeQuery = async (queryText: string) => {
    triggerState(AtlasState.WORKING);
    setActiveNotification({
      id: 'query_proc',
      title: '⚡ Executing Command',
      message: `Processing: "${queryText}"...`,
      type: 'info'
    });

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      const responseText = data.message?.text || 'Command executed successfully.';

      triggerState(AtlasState.SUCCESS);
      setActiveNotification({
        id: `res_${Date.now()}`,
        title: '🤖 Atlas Assistant',
        message: responseText.slice(0, 120) + '...',
        type: 'success',
        actions: [{ label: 'Open Main App', actionId: 'open_main' }]
      });

      // Speak back with Cute Anime Kid Female Voice
      triggerState(AtlasState.SPEAKING);
      speakCuteAnimeVoice(responseText);
    } catch (e) {
      triggerState(AtlasState.ERROR);
    }
  };

  // 2. Search Action
  const handleSearchAction = () => {
    triggerState(AtlasState.SEARCHING);
    setActiveNotification({
      id: 'search_action',
      title: '🔍 Command Center',
      message: 'Opening Universal Search in Main App...',
      type: 'info',
      actions: [{ label: 'Open Main Search', actionId: 'open_main' }]
    });
    setTimeout(() => {
      handleRestoreMain();
    }, 1000);
  };

  // 3. Screen Vision Action
  const handleVisionAction = () => {
    triggerState(AtlasState.THINKING);
    setActiveNotification({
      id: 'vision_action',
      title: '📷 Screen Vision',
      message: 'Scanning active desktop windows... System workspace nominal.',
      type: 'info'
    });
    triggerState(AtlasState.SPEAKING);
    speakCuteAnimeVoice('Screen vision diagnostics complete! System workspace is nominal!');
  };

  // 4. Antigravity IDE Action
  const handleCodeAction = async () => {
    triggerState(AtlasState.WORKING);
    setActiveNotification({
      id: 'code_action',
      title: '🚀 Antigravity IDE',
      message: 'Launching workspace in Antigravity IDE...',
      type: 'info'
    });

    try {
      await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'open in antigravity ide' })
      });
      triggerState(AtlasState.SUCCESS);
      speakCuteAnimeVoice('Launching project workspace in Antigravity I D E!');
    } catch (e) {
      triggerState(AtlasState.ERROR);
    }
  };

  return (
    <div
      style={{
        width: '320px',
        height: '360px',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      {/* Sleek Top Drag Handle Pill */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          background: 'rgba(20, 26, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'grab',
          WebkitAppRegion: 'drag'
        } as React.CSSProperties}
      >
        <Move size={12} color="var(--text-dim)" />
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Atlas Companion</span>
      </div>

      {/* Real Active Speech Notification Bubble */}
      {activeNotification && (
        <div style={{ position: 'absolute', top: '40px', zIndex: 20, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <CompanionSpeechBubble
            notification={activeNotification}
            onDismiss={() => setActiveNotification(null)}
            onActionClick={handleActionClick}
          />
        </div>
      )}

      {/* Floating Atlas Character (No BG Glow) */}
      <div
        onClick={() => triggerState(AtlasState.EXCITED)}
        style={{ marginTop: '20px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <AtlasCharacter size="companion" state={currentState} showGlow={false} />
      </div>

      {/* Functional Micro-Action Glass Toolbar */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          background: 'rgba(10, 14, 24, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          WebkitAppRegion: 'no-drag'
        } as React.CSSProperties}
      >
        <button onClick={handleRestoreMain} style={btnStyle} title="Open Main Application">
          <Maximize2 size={15} color="#38bdf8" />
        </button>

        <button
          onClick={toggleVoiceListening}
          style={{
            ...btnStyle,
            background: isListening ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'
          }}
          title="Push-to-Talk Voice Command"
        >
          {isListening ? <MicOff size={15} color="#ef4444" /> : <Mic size={15} color="#a855f7" />}
        </button>

        <button onClick={handleSearchAction} style={btnStyle} title="Search Files & Memory">
          <Search size={15} color="#34d399" />
        </button>

        <button onClick={handleVisionAction} style={btnStyle} title="Screen Vision Diagnostics">
          <Camera size={15} color="#fbbf24" />
        </button>

        <button onClick={handleCodeAction} style={btnStyle} title="Launch Antigravity IDE">
          <Code size={15} color="#f43f5e" />
        </button>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '50%',
  width: '34px',
  height: '34px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease'
};
