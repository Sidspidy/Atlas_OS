import React, { useEffect, useState } from 'react';
import { MemoryNode, MemoryCategory } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Brain, Search, Plus, Trash2, Tag, Calendar, Database, Sparkles } from 'lucide-react';

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Memory Form State
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('PREFERENCE');

  const fetchMemories = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/memory/nodes');
      const data = await res.json();
      if (data && data.nodes) {
        setMemories(data.nodes);
      }
    } catch (e) {
      console.warn('[MemoryView] Failed to fetch memory nodes:', e);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleCreateMemory = async () => {
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const res = await fetch('http://localhost:3001/api/memory/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          key: newKey,
          value: newValue,
          source: 'User Manual Entry'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewKey('');
        setNewValue('');
        setShowAddForm(false);
        await fetchMemories();
      }
    } catch (e) {
      console.warn('[MemoryView] Failed to create memory:', e);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/memory/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.warn('[MemoryView] Failed to delete memory:', e);
    }
  };

  const categories = ['ALL', 'PROJECT', 'FILE', 'CODE', 'DOCUMENT', 'CONVERSATION', 'TASK', 'PERSON', 'PREFERENCE', 'EVENT', 'DECISION'];

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = activeCategory === 'ALL' || m.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Persistent Memory Explorer</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Inspect, search, create, or delete persistent memory nodes & context preferences
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add Memory Note'}
        </Button>
      </div>

      {/* Manual Memory Note Creation Modal/Form */}
      {showAddForm && (
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'var(--accent-purple)' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-purple)" /> Create Custom Memory Note
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Memory Key (e.g. Preferred Editor)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Memory Value (e.g. VS Code with Vim extension)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              style={inputStyle}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
              style={inputStyle}
            >
              {categories.filter((c) => c !== 'ALL').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="primary" onClick={handleCreateMemory}>Save Memory Node</Button>
          </div>
        </GlassPanel>
      )}

      {/* Semantic Search & Category Filter Bar */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search memory graph semantically or filter by key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--accent-purple)' : 'var(--bg-glass-hover)',
                color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-glass)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Memory Nodes List */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--accent-purple)" />
            Persistent Memory Graph ({filteredMemories.length})
          </div>
        </div>

        {filteredMemories.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No memory nodes match your search criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMemories.map((mem) => (
              <MemoryCard key={mem.id} memory={mem} onDelete={() => handleDeleteMemory(mem.id)} />
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

const MemoryCard: React.FC<{ memory: MemoryNode; onDelete: () => void }> = ({ memory, onDelete }) => (
  <div
    style={{
      background: 'var(--bg-secondary)',
      padding: '16px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(192, 132, 252, 0.2)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
          <Tag size={10} style={{ marginRight: '4px' }} /> {memory.category}
        </span>
        <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{memory.key}</strong>
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
        {memory.value}
      </div>
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
        <span>Source: {memory.source || 'Unknown'}</span>
        <span>Created: {new Date(memory.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <button
      onClick={onDelete}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--text-dim)',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.2s ease'
      }}
      title="Forget / Delete Memory Node"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-glass)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  color: 'var(--text-main)',
  fontSize: '13px',
  outline: 'none'
};
