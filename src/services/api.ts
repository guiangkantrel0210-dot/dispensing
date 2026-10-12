import { MicroLesson } from '../types';

export async function fetchMicroLesson(topic: string, patientName?: string, shiftType?: string): Promise<{ lesson: MicroLesson; isAiGenerated: boolean }> {
  try {
    const res = await fetch('/api/gemini/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, patientName, shiftType })
    });
    const data = await res.json();
    if (data.success && data.lesson) {
      return { lesson: data.lesson, isAiGenerated: data.isAiGenerated };
    }
  } catch (err) {
    console.warn('API error, falling back:', err);
  }

  // Resilient fallback
  return {
    lesson: {
      title: "The Asymptomatic Illusion & Vascular Protection",
      audioScript: "Hello Andres. Even when your head feels clear and your energy feels normal today, your blood vessels still need their daily shield. High blood pressure is silent—it does not cause pain until vascular walls are worn down. Taking your Amlodipine and Losartan today ensures your arteries stay relaxed while driving through city traffic.",
      clinicalExplanation: "Hypertension is clinically classified as a 'silent killer' because endothelial stress and arterial micro-damage progress without somatic symptoms. Abrupt discontinuation when feeling well causes rebound vasoconstriction and spikes cardiovascular event risk.",
      keyTakeaway: "Amlodipine relaxes arterial smooth muscle continuously; Losartan blocks Angiotensin II receptors. Consistency is prevention, not symptom suppression."
    },
    isAiGenerated: false
  };
}

export async function fetchShiftAdvice(currentShift: string, lastDoseTime: string, recordedBP: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/shift-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentShift, lastDoseTime, recordedBP })
    });
    const data = await res.json();
    if (data.success && data.advice) {
      return data.advice;
    }
  } catch (err) {
    console.warn('API shift advice error:', err);
  }

  return `Dock your smartphone right after returning from your shift to trigger your post-driving recovery dose safely. Your high-output acoustic speaker will confirm dispensing.`;
}

// Audio Utilities using Web Audio API for hardware dispenser sounds
export function playDispenserSound(type: 'chime' | 'dispense' | 'alert' | 'success') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'chime') {
      // Pleasant cat friendly high-output chime (representing base speaker)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'dispense') {
      // Mechanical precision motor click & pill drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'alert') {
      // Urgent acoustic speaker alert
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'success') {
      // Harmonic verification tone
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  } catch (e) {
    console.debug('Web Audio not available', e);
  }
}

// Speech synthesis voice for daily audio lessons
export function speakText(text: string, onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const warmVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (warmVoice) {
    utterance.voice = warmVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export interface VoiceChatResponse {
  reply: string;
  action?: 'DISPENSE' | 'SHOW_MAP' | 'SHOW_CALENDAR' | 'SHOW_SETTINGS' | null;
  isAiGenerated: boolean;
}

export async function sendVoiceChatMessage(
  message: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = [],
  battery: number = 96
): Promise<VoiceChatResponse> {
  try {
    const res = await fetch('/api/gemini/voice-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, battery })
    });
    const data = await res.json();
    if (data.success) {
      return {
        reply: data.reply,
        action: data.action,
        isAiGenerated: data.isAiGenerated
      };
    }
  } catch (err) {
    console.warn('Voice chat API error:', err);
  }

  // Graceful rule-based fallback
  const normalized = message.toLowerCase();
  let action: VoiceChatResponse['action'] = null;
  let reply = "Hello Andres! I am listening. Your Amlodipine 10mg and Losartan 50mg are ready in my ear compartments.";

  if (normalized.includes('dispense') || normalized.includes('take pill')) {
    action = 'DISPENSE';
    reply = "Releasing your Amlodipine 10mg and Losartan 50mg into my mouth tray now, Andres. Take them with water.";
  } else if (normalized.includes('map') || normalized.includes('pharmacy') || normalized.includes('cheapest')) {
    action = 'SHOW_MAP';
    reply = "Opening your pharmacy price comparison map. City Center Pharmacy has your generic combo for $18.50.";
  } else if (normalized.includes('calendar') || normalized.includes('streak') || normalized.includes('adherence')) {
    action = 'SHOW_CALENDAR';
    reply = "Opening your adherence calendar. You have a 14-day streak and 94% monthly adherence!";
  } else if (normalized.includes('feel fine') || normalized.includes('feeling fine')) {
    reply = "Even when you feel energetic and healthy, high blood pressure quietly strains your blood vessels. Taking your medicine today prevents silent damage.";
  }

  return { reply, action, isAiGenerated: false };
}

