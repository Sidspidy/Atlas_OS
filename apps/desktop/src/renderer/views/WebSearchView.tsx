import React, { useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Globe, Search, ExternalLink, RefreshCw, Compass } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const WebSearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Latest AI news and tech trends 2026');
  const [searchResults, setSearchResults] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const handleWebSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Search the web and summarize: ${searchQuery}` })
      });
      const data = await res.json();
      if (data.success && data.message?.text) {
        setSearchResults(data.message.text);
        speakCuteAnimeVoice('Web search and live summary completed!');
      }
    } catch (e) {
    } finally {
      setIsSearching(false);
    }
  };

  const handleLaunchBrowser = async () => {
    try {
      await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'open browser' })
      });
    } catch (e) {}
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Web Search & Live Browser Engine</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Live web search, web page text extraction, and 1-click system browser tab launcher
          </p>
        </div>
        <Button variant="primary" onClick={handleLaunchBrowser}>
          <ExternalLink size={16} /> Open System Browser
        </Button>
      </div>

      {/* Search Input Panel */}
      <GlassPanel style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Globe size={22} color="#38bdf8" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleWebSearch()}
          placeholder="Search live web topics, documentation, or tech news..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '15px',
            outline: 'none'
          }}
        />
        <Button variant="primary" onClick={handleWebSearch} disabled={isSearching}>
          {isSearching ? <RefreshCw size={16} className="atlas-spin" /> : <Search size={16} />}
          Search Web
        </Button>
      </GlassPanel>

      {/* Search Results Display */}
      {searchResults ? (
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <Compass size={18} color="#a855f7" />
            AI Grounded Web Summary Results
          </div>
          <div style={{ fontSize: '14px', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', whiteSpace: 'pre-wrap', color: '#fff' }}>
            {searchResults}
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
          Type a search topic above to perform live AI web synthesis!
        </GlassPanel>
      )}
    </div>
  );
};
