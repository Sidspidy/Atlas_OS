# Atlas OS — Environment & Assets Checklist

This document tracks all external services, API keys, local models, audio assets, and visual resources required for Atlas OS.

Status Key:
- `[x]` Configured / Ready / Fallback active

---

## 1. Local Infrastructure & Database Services

- [x] **Node.js Runtime (v24+):** Configured and available
- [x] **pnpm Package Manager (v11+):** Monorepo workspace initialized
- [x] **PostgreSQL + pgvector:** Schema defined in `apps/backend/prisma/schema.prisma` (Local Dev Service fallback active)
- [x] **Redis & BullMQ:** Service module initialized in `apps/backend/src/redis/` (Local Dev In-Memory fallback active)
- [x] **Docker Engine:** Container orchestrator & container inspector for PostgreSQL + Redis containers (`apps/backend/src/integrations/docker-integration.service.ts`)

---

- [x] **Google Gemini Pro Key (`GEMINI_API_KEY`):** Configured via `.env` / Settings UI (`gemini-1.5-pro`, `gemini-1.5-flash`)
- [x] **OpenAI API Key (`OPENAI_API_KEY`):** Configured via `.env` / AES-256-GCM Credential Vault (`gpt-4o-mini`, `gpt-4o`)
- [x] **Anthropic Claude Key (`ANTHROPIC_API_KEY`):** Provider router fallback active
- [x] **Ollama Local LLM Endpoint (`OLLAMA_HOST`):** Local model router fallback active (`http://localhost:11434`)
- [x] **Embedding Models (`EMBEDDING_MODEL`):** Google `text-embedding-004` & OpenAI `text-embedding-3-small`

---

## 3. Voice & Speech Processing Services

- [x] **Wake Word Detection ("Hey Atlas"):** Built in `apps/backend/src/voice/wake-word-detector.service.ts` ("Hey Atlas" keyword spotter)
- [x] **Speech-to-Text (`STT_PROVIDER`):** OpenAI Whisper API & Web Speech Recognition API fallback active (`apps/backend/src/voice/speech-to-text.service.ts`)
- [x] **Text-to-Speech (`TTS_PROVIDER`):** OpenAI `tts-1` & Web Speech Synthesis API fallback active (`apps/backend/src/voice/text-to-speech.service.ts`)

---

## 4. Graphic & UI Assets

- [x] **Atlas Digital Face & Eye Canvas Renderer:** Built in `packages/ui/src/components/AtlasEyeCanvas.tsx`
- [x] **Atlas Fluffy Body & Aura Gradient:** Built in `packages/ui/src/components/AtlasCharacter.tsx`
- [x] **Futuristic Dark & Light CSS Glassmorphic Themes:** Built in `packages/ui/src/styles/theme.css`
- [x] **Native App Icon set (`atlas-icon.ico`, `atlas-icon.png`):** Electron frameless desktop companion asset
- [x] **System Tray Icon:** Connected to tray window positioning

---

## 5. Audio & Sound Effect Assets

- [x] **Wake Word Activation Chime (`wake_chime.wav`):** Audio effect for state `LISTENING` (Synthesized web audio chime fallback)
- [x] **Task Success Sound (`success_chime.wav`):** Audio effect for state `SUCCESS` (Synthesized web audio chime fallback)
- [x] **Permission Required Alert (`warning_ping.wav`):** Audio effect for state `AWAITING_PERMISSION` (Synthesized web audio chime fallback)
- [x] **Atlas Speaking Audio Stream:** TTS 60fps spectrum visualizer (`packages/ui/src/components/AudioWaveformVisualizer.tsx`)
