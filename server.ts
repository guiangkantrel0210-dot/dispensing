import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Fallback micro-lessons for "Feeling Fine" fallacy & shift worker hypertension
const FALLBACK_LESSONS: Record<string, { title: string; audioScript: string; clinicalExplanation: string; keyTakeaway: string }> = {
  feeling_fine: {
    title: "The Asymptomatic Illusion & Vascular Protection",
    audioScript: "Hello Andres. Even when your head feels clear and your energy feels normal today, your blood vessels still need their daily shield. High blood pressure is silent—it does not cause pain until vascular walls are worn down. Taking your Amlodipine and Losartan today ensures your arteries stay relaxed while driving through city traffic.",
    clinicalExplanation: "Hypertension is clinically classified as a 'silent killer' because endothelial stress and arterial micro-damage progress without somatic symptoms. Abrupt discontinuation when feeling well causes rebound vasoconstriction and spikes cardiovascular event risk.",
    keyTakeaway: "Amlodipine relaxes arterial smooth muscle continuously; Losartan blocks Angiotensin II receptors. Consistency is prevention, not symptom suppression."
  },
  irregular_shifts: {
    title: "Shift-Work Circadian Alignment & Dosage Timing",
    audioScript: "Taxi shifts disrupt your body's natural 24-hour clock. When transitioning from day to evening shifts, your MAAAOEW dispenser adjusts your alert window so you never take dual doses too close together or skip during long passenger trips.",
    clinicalExplanation: "Circadian misalignment in professional drivers causes sympathetic overactivity and nocturnal non-dipping blood pressure. Dynamic shift anchoring prevents both severe morning hypotensive dips and evening hypertensive surges.",
    keyTakeaway: "Dock your smartphone when your shift ends to trigger your post-driving recovery dose safely."
  },
  generic_savings: {
    title: "Bioequivalence & Refill Peace of Mind",
    audioScript: "Andres, the generic Amlodipine and Losartan dispensed in your cat compartments have the identical active molecules and clinical potency as brand-name drugs, saving you up to 70% each month through your community clinic program.",
    clinicalExplanation: "FDA/WHO bioequivalence guidelines mandate identical pharmacokinetic AUC and Cmax profiles (within 80-125% 90% CI) for generic antihypertensives, eliminating financial toxicity without compromising blood pressure control.",
    keyTakeaway: "Refill automation syncs directly with local community clinics for subsidized bioequivalent packages."
  }
};

// API: Generate daily audio educational micro-lesson
app.post('/api/gemini/lesson', async (req, res) => {
  const { topic = 'feeling_fine', patientName = 'Mr. Andres Gonzales', shiftType = 'Hectic Taxi Shift' } = req.body;

  if (!ai) {
    const fallback = FALLBACK_LESSONS[topic] || FALLBACK_LESSONS.feeling_fine;
    return res.json({ success: true, isAiGenerated: false, lesson: fallback });
  }

  try {
    const prompt = `You are the AI clinical voice companion inside the MAAAOEW smart smartphone-docked medication dispenser (for hypertension management).
The patient is ${patientName}, a 60-year-old taxi driver who lives alone and is prescribed Amlodipine 10mg + Losartan 50mg daily.
Topic requested: "${topic}" (Context: Patient has irregular shifts, symptom illusion of "feeling fine", and refill cost anxiety).
Provide an engaging, medically sound, and compassionate micro-lesson.

Respond in valid JSON only with keys:
- title: concise title (e.g., "Combating the 'Feeling Fine' Fallacy: Continuous Arterial Protection")
- audioScript: natural, spoken conversational text (3-4 sentences, warm and clear, suitable for high-decibel speaker output in a taxi driver's bedroom or dock)
- clinicalExplanation: 2-3 sentences explaining the pharmacology/physiology (Amlodipine + Losartan) and vascular risk
- keyTakeaway: single memorable actionable takeaway sentence.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, isAiGenerated: true, lesson: parsed });
  } catch (error) {
    console.error('Gemini lesson error:', error);
    const fallback = FALLBACK_LESSONS[topic] || FALLBACK_LESSONS.feeling_fine;
    return res.json({ success: true, isAiGenerated: false, lesson: fallback });
  }
});

// API: Shift-based dynamic reminder and regimen guidance
app.post('/api/gemini/shift-advice', async (req, res) => {
  const { currentShift, lastDoseTime, recordedBP } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      isAiGenerated: false,
      advice: `For your ${currentShift || 'current'} shift schedule, take your Amlodipine 10mg and Losartan 50mg when docking your phone. Keeping your phone docked ensures the OLED eyes confirm dispensing while recharging your taxi navigation phone.`
    });
  }

  try {
    const prompt = `As the MAAAOEW hypertension assistant for a shift-working taxi driver:
Current Shift: ${currentShift || 'Split Shift (Morning + Evening Rush)'}
Last Dose: ${lastDoseTime || 'Yesterday 8:00 PM'}
Current BP: ${recordedBP || '142/88 mmHg'}
Medications: Amlodipine 10mg + Losartan 50mg.

Provide concise advice (max 2 sentences) on optimal docking and medication timing for this driving schedule, maintaining safe BP without drowsiness. Respond in plain text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return res.json({
      success: true,
      isAiGenerated: true,
      advice: response.text?.trim()
    });
  } catch (error) {
    console.error('Gemini shift advice error:', error);
    return res.json({
      success: true,
      isAiGenerated: false,
      advice: `For your ${currentShift || 'current'} shift schedule, dock your phone upon returning home to safely dispense your Amlodipine and Losartan. Your dock's speaker and OLED lights will confirm verification.`
    });
  }
});

// API: Voice Chat Assistant with command intent detection
app.post('/api/gemini/voice-chat', async (req, res) => {
  const { message, history = [], currentShift = 'Split Shift', battery = 96 } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const normalized = message.toLowerCase().trim();

  // Quick offline rule-based actions for immediate speed
  let detectedAction: string | null = null;
  if (normalized.includes('dispense') || normalized.includes('take pill') || normalized.includes('give me my pill') || normalized.includes('release dose')) {
    detectedAction = 'DISPENSE';
  } else if (normalized.includes('map') || normalized.includes('pharmacy') || normalized.includes('cheapest') || normalized.includes('refill')) {
    detectedAction = 'SHOW_MAP';
  } else if (normalized.includes('calendar') || normalized.includes('streak') || normalized.includes('adherence') || normalized.includes('tracker')) {
    detectedAction = 'SHOW_CALENDAR';
  } else if (normalized.includes('setting') || normalized.includes('volume') || normalized.includes('speaker') || normalized.includes('loud')) {
    detectedAction = 'SHOW_SETTINGS';
  }

  if (!ai) {
    let reply = "Hello Andres! I am your MAAAOEW cat companion. Your Amlodipine 10mg and Losartan 50mg are ready in my ear compartments. You can ask me to dispense them or explain your vascular protection.";
    if (detectedAction === 'DISPENSE') {
      reply = "Right away, Andres! Releasing your Amlodipine 10mg and Losartan 50mg into my mouth tray now. Remember to drink a full glass of water.";
    } else if (normalized.includes('feel fine') || normalized.includes('feeling fine')) {
      reply = "Even when you feel energetic and symptom-free, your blood vessels still face hydraulic friction. High blood pressure is silent—taking your daily dose preserves arterial elasticity against stroke risk!";
    } else if (normalized.includes('battery') || normalized.includes('charge')) {
      reply = `Your phone is currently docked on my Qi fast-charger at ${battery}% battery. It is powering my companion brain smoothly.`;
    }

    return res.json({
      success: true,
      isAiGenerated: false,
      reply,
      action: detectedAction
    });
  }

  try {
    const systemInstruction = `You are MAAAOEW (Medication Adherence Artificial-Intelligent Assistant for Optimal Efficacy), a warm, supportive, and medically precise cat-inspired smart companion dispenser.
The patient is Mr. Andres Gonzales, a 60-year-old taxi driver with hypertension (prescribed Amlodipine 10mg + Losartan 50mg daily).
Key traits:
- Speak concisely (2 to 4 sentences max) because your response will be read aloud through the dock's high-decibel acoustic speaker.
- Be warm and encouraging, treating him with dignity.
- If he asks why he should take medication when feeling well, address the "Feeling Fine Fallacy" (silent hypertension causes microvascular damage without pain).
- If he asks to dispense, confirm that his dose is releasing into the mouth tray.
- If he asks about shifts, explain how docking post-shift protects his recovery window.

Respond in JSON format:
{
  "reply": "Spoken response text",
  "action": "DISPENSE" | "SHOW_MAP" | "SHOW_CALENDAR" | "SHOW_SETTINGS" | "NONE"
}`;

    const conversationContext = history
      .slice(-4)
      .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Andres' : 'MAAAOEW'}: ${h.text}`)
      .join('\n');

    const prompt = `${systemInstruction}\n\nRecent context:\n${conversationContext}\n\nAndres says: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      isAiGenerated: true,
      reply: parsed.reply || "I heard you, Andres. Your regimen is active and your vascular protection is on track.",
      action: parsed.action !== 'NONE' ? parsed.action : detectedAction
    });
  } catch (error) {
    console.error('Gemini voice chat error:', error);
    return res.json({
      success: true,
      isAiGenerated: false,
      reply: detectedAction === 'DISPENSE'
        ? "Releasing your Amlodipine 10mg and Losartan 50mg into my mouth tray now, Andres."
        : "I am with you, Andres. Your hypertension regimen is loaded in my cat ears and ready for your shift rest.",
      action: detectedAction
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAAAOEW server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
