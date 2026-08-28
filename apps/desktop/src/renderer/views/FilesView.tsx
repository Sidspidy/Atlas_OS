import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { DirectoryScope, IndexedFileRecord } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { FolderPlus, FileText, CheckCircle2, Clock, ShieldCheck, RefreshCw, HardDrive, Filter } from 'lucide-react';

export const FilesView: React.FC = () => {
  const [directories, setDirectories] = useState<DirectoryScope[]>([]);
  const [files, setFiles] = useState<IndexedFileRecord[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState<string>('');

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

  const handleSelectAndIndexDirectory = async () => {
    if (!window.atlasAPI) return;

    const selectedPath = await window.atlasAPI.selectDirectory();
    if (!selectedPath) return;

    setIsIndexing(true);
    setIndexingProgress(`Scanning directory: ${selectedPath}`);
    window.atlasAPI.setState(AtlasState.SEARCHING);

    setTimeout(async () => {
      window.atlasAPI?.setState(AtlasState.WORKING);
      setIndexingProgress(`Extracting content & metadata...`);

      const result = await window.atlasAPI?.indexDirectory(selectedPath);

      if (result && result.success) {
        window.atlasAPI?.setState(AtlasState.SUCCESS);
        setIndexingProgress(`Indexed successfully!`);
        await loadIndexedFiles();
      } else {
        window.atlasAPI?.setState(AtlasState.ERROR);
        setIndexingProgress(`Failed to index directory.`);
      }

      setTimeout(() => {
        setIsIndexing(false);
        setIndexingProgress('');
        window.atlasAPI?.setState(AtlasState.IDLE);
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
          <Button variant="primary" onClick={handleSelectAndIndexDirectory} disabled={isIndexing}>
            <FolderPlus size={16} /> Add Directory to Index
          </Button>
        </div>
      </div>

      {/* Indexing Live Status Notification */}
      {isIndexing && (
        <GlassPanel style={{ display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--accent-cyan)' }}>
          <RefreshCw size={18} color="var(--accent-cyan)" className="atlas-spin" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{indexingProgress}</span>
        </GlassPanel>
      )}

      {/* Directory Scopes Overview */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={18} color="var(--accent-cyan)" />
            Indexed Workspace Folders ({directories.length})
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Total Files: <strong style={{ color: 'var(--text-main)' }}>{files.length}</strong>
          </span>
        </div>

        {directories.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No directories indexed yet. Click "Add Directory to Index" to select a project folder.
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
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--accent-emerald)" />
          Sensitive Path Exclusions & Privacy Rules
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Atlas automatically excludes system folders, binary executables, build artifacts (<code>node_modules</code>, <code>.git</code>, <code>dist</code>, <code>build</code>), and secret files (<code>.env</code>) to ensure user privacy and maximum indexing speed.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          {['node_modules', '.git', '.env', 'dist', 'build', '*.exe', '*.png', '*.mp4'].map((ex, i) => (
            <span key={i} style={{ fontSize: '11px', background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
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
        background: 'var(--bg-secondary)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText size={20} color="var(--accent-cyan)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{dirPath}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {fileCount} files indexed • {formatSize(sizeBytes)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
          <CheckCircle2 size={14} /> {status}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
          <Clock size={14} /> {new Date(indexedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
