import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { DirectoryScope, IndexedFileRecord } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { FolderPlus, FileText, CheckCircle2, Clock, ShieldCheck, RefreshCw, HardDrive, Filter, X, Search, Folder, ChevronRight, ArrowUpRight } from 'lucide-react';

export const FilesView: React.FC = () => {
  const [directories, setDirectories] = useState<DirectoryScope[]>([]);
  const [files, setFiles] = useState<IndexedFileRecord[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customPathInput, setCustomPathInput] = useState('e:/my_projects');

  const loadIndexedFiles = async () => {
    if (window.atlasAPI) {
      const res = await window.atlasAPI.getIndexedFiles();
      if (res) {
        setFiles(res.files || []);
        setDirectories(res.directories || []);
      }
    }
  };

  useEffect(() => {
    loadIndexedFiles();
  }, []);

  const handleStartIndexing = async (pathToIndex: string) => {
    setIsModalOpen(false);
    setIsIndexing(true);
    setIndexingProgress(`Scanning directory: ${pathToIndex}`);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SEARCHING);

    setTimeout(async () => {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.WORKING);
      setIndexingProgress(`Extracting content & text metadata...`);

      let result;
      if (window.atlasAPI) {
        result = await window.atlasAPI.indexDirectory(pathToIndex);
      } else {
        // Fallback fetch if running in direct web mode
        try {
          const res = await fetch('http://localhost:3001/api/files/index-directory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ directoryPath: pathToIndex })
          });
          result = await res.json();
        } catch (e) {}
      }

      if (result && result.success) {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
        setIndexingProgress(`Indexed successfully!`);
        await loadIndexedFiles();
      } else {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
        setIndexingProgress(`Failed to index directory.`);
      }

      setTimeout(() => {
        setIsIndexing(false);
        setIndexingProgress('');
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 2000);
    }, 600);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Local File System Engine</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Local folder indexing, text extraction & background change watching
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" onClick={loadIndexedFiles}>
            <RefreshCw size={15} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} disabled={isIndexing}>
            <FolderPlus size={16} /> Browse & Add Directory
          </Button>
        </div>
      </div>

      {/* Custom Glass File Browser Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 13, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}
        >
          <GlassPanel
            glow
            style={{
              width: '620px',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '28px',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderPlus size={22} color="#a855f7" />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Glass Directory Explorer</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Browse or type any folder path to index in Atlas OS</div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Manual Path Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Workspace Directory Path:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={customPathInput}
                  onChange={(e) => setCustomPathInput(e.target.value)}
                  placeholder="e.g. e:/my_projects or C:/Users/YourName/Downloads"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
                <Button variant="primary" onClick={() => handleStartIndexing(customPathInput)}>
                  Index Path
                </Button>
              </div>
            </div>

            {/* Quick Access System Locations */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>Quick System Locations:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { name: 'Downloads', path: 'C:/Users/Sidhanathan K/Downloads', icon: Folder },
                  { name: 'Projects Workspace', path: 'e:/my_projects', icon: HardDrive },
                  { name: 'Documents', path: 'C:/Users/Sidhanathan K/Documents', icon: Folder },
                  { name: 'Desktop', path: 'C:/Users/Sidhanathan K/Desktop', icon: Folder },
                  { name: 'C: Drive Root', path: 'C:/', icon: HardDrive },
                  { name: 'E: Drive Root', path: 'E:/', icon: HardDrive }
                ].map((loc, i) => {
                  const Icon = loc.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleStartIndexing(loc.path)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#fff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={16} color="#38bdf8" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{loc.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{loc.path.slice(0, 20)}...</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Indexing Live Status Notification */}
      {isIndexing && (
        <GlassPanel style={{ display: 'flex', alignItems: 'center', gap: '12px', borderColor: '#38bdf8' }}>
          <RefreshCw size={18} color="#38bdf8" className="atlas-spin" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{indexingProgress}</span>
        </GlassPanel>
      )}

      {/* Directory Scopes Overview */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <HardDrive size={18} color="#38bdf8" />
            Indexed Workspace Folders ({directories.length})
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Total Files: <strong style={{ color: '#fff' }}>{files.length}</strong>
          </span>
        </div>

        {directories.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No directories indexed yet. Click "Browse & Add Directory" to select a project folder.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {directories.map((dir, idx) => (
              <FolderRow key={idx} path={dir.path} files={dir.fileCount} sizeBytes={dir.totalSizeBytes} status={dir.status} indexedAt={dir.indexedAt} />
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Exclusions & Privacy Security Panel */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
          <ShieldCheck size={18} color="#34d399" />
          Sensitive Path Exclusions & Privacy Rules
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Atlas automatically excludes system folders, binary executables, build artifacts (<code>node_modules</code>, <code>.git</code>, <code>dist</code>, <code>build</code>), and secret files (<code>.env</code>) to ensure user privacy and maximum indexing speed.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          {['node_modules', '.git', '.env', 'dist', 'build', '*.exe', '*.png', '*.mp4'].map((ex, i) => (
            <span key={i} style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-dim)' }}>
              <Filter size={10} style={{ marginRight: '4px' }} /> Excluded: {ex}
            </span>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};

const FolderRow: React.FC<{ path: string; files: number; sizeBytes: number; status: string; indexedAt: string }> = ({
  path: dirPath,
  files: fileCount,
  sizeBytes,
  status,
  indexedAt
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText size={20} color="#38bdf8" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{dirPath}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {fileCount} files indexed • {formatSize(sizeBytes)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
          <CheckCircle2 size={14} /> {status}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
          <Clock size={14} /> {new Date(indexedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
