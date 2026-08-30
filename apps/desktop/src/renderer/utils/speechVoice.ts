import { AtlasState } from '@atlas-os/shared';

// Cute Anime / Kid Female Voice Synthesizer
let cachedFemaleVoice: SpeechSynthesisVoice | null = null;

const loadFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (cachedFemaleVoice) return cachedFemaleVoice;
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Search for female / anime / kid voices in order of preference
  const femaleVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return (
      name.includes('zira') ||
      name.includes('jenny') ||
      name.includes('eva') ||
      name.includes('hazel') ||
      name.includes('samantha') ||
      name.includes('victoria') ||
      name.includes('karen') ||
      name.includes('moira') ||
      name.includes('fiona') ||
      name.includes('kyoko') ||
      name.includes('hana') ||
      (name.includes('female') && lang.includes('en'))
    );
  });

  if (femaleVoice) {
    cachedFemaleVoice = femaleVoice;
    return femaleVoice;
  }

  // Fallback to any non-David voice
  const fallback = voices.find((v) => !v.name.toLowerCase().includes('david') && !v.name.toLowerCase().includes('mark'));
  if (fallback) {
    cachedFemaleVoice = fallback;
    return fallback;
  }

  return voices[0] || null;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedFemaleVoice = null;
    loadFemaleVoice();
  };
}

export const speakCuteAnimeVoice = (text: string, rateMultiplier: number = 1.1) => {
  if (!('speechSynthesis' in window) || !text) return;

  try {
    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean markdown symbols for natural vocal speech
    const cleanText = text
      .replace(/[#*`|_~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    // Trigger SPEAKING state for vocal equalizer eye animation
    if ((window as any).atlasAPI && (window as any).atlasAPI.setState) {
      (window as any).atlasAPI.setState(AtlasState.SPEAKING);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Cute Anime / Kid Female Voice Tuning
    utterance.pitch = 1.65; // High pitch for cute anime kid female voice
    utterance.rate = rateMultiplier; // Upbeat pace

    const voice = loadFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      // Automatically reset character eyes back to normal IDLE state after speech finishes
      if ((window as any).atlasAPI && (window as any).atlasAPI.setState) {
        (window as any).atlasAPI.setState(AtlasState.IDLE);
      }
    };

    utterance.onerror = () => {
      if ((window as any).atlasAPI && (window as any).atlasAPI.setState) {
        (window as any).atlasAPI.setState(AtlasState.IDLE);
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[SpeechVoice] Synthesis error:', e);
    if ((window as any).atlasAPI && (window as any).atlasAPI.setState) {
      (window as any).atlasAPI.setState(AtlasState.IDLE);
    }
  }
};
