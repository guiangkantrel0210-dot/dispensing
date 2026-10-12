import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, Pill, MapPin, Calendar, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { sendVoiceChatMessage, playDispenserSound, speakText } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTriggered?: string | null;
}

interface VoiceChatMenuProps {
  batteryLevel: number;
  onTriggerDispense: () => void;
  onNavigateTab: (tab: 'calendar' | 'maps' | 'settings') => void;
  isDocked: boolean;
  highOutputSpeaker: boolean;
}

export const VoiceChatMenu: React.FC<VoiceChatMenuProps> = ({
  batteryLevel,
  onTriggerDispense,
  onNavigateTab,
  isDocked,
  highOutputSpeaker
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Meow! Hello Andres. I am docked and listening through your high-output speaker. How are you feeling after your taxi shift?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const reco = new SpeechRecognition();
          reco.continuous = false;
          reco.interimResults = true;
          reco.lang = 'en-US';

          reco.onstart = () => {
            setIsListening(true);
            setRecognitionError(null);
            playDispenserSound('chime');
          };

          reco.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript;
            }
            setInputText(transcript);
          };

          reco.onerror = (event: any) => {
            console.warn('Speech recognition event:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
              setRecognitionError('Microphone permission needed. You can also tap commands below.');
            }
          };

          reco.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = reco;
        } catch (e) {
          console.warn('Speech recognition init error:', e);
          setVoiceSupported(false);
        }
      } else {
        setVoiceSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (cancelSpeechRef.current) {
        cancelSpeechRef.current();
      }
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setRecognitionError('Speech recognition is not supported in this browser. Please use text input or prompt buttons.');
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (cancelSpeechRef.current) {
      cancelSpeechRef.current();
      setIsSpeaking(false);
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({ sender: m.sender, text: m.text }));
      const response = await sendVoiceChatMessage(query, historyPayload, batteryLevel);

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTriggered: response.action
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Execute detected voice action
      if (response.action === 'DISPENSE') {
        playDispenserSound('dispense');
        setTimeout(() => {
          onTriggerDispense();
        }, 600);
      } else if (response.action === 'SHOW_MAP') {
        onNavigateTab('maps');
      } else if (response.action === 'SHOW_CALENDAR') {
        onNavigateTab('calendar');
      } else if (response.action === 'SHOW_SETTINGS') {
        onNavigateTab('settings');
      }

      // Voice read-out through speaker
      if (highOutputSpeaker) {
        setIsSpeaking(true);
        const cancel = speakText(response.reply, () => {
          setIsSpeaking(false);
        });
        cancelSpeechRef.current = cancel;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCommand = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const stopSpeaking = () => {
    if (cancelSpeechRef.current) {
      cancelSpeechRef.current();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header with status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              High-Output Voice Recognition
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            MAAAOEW Voice Assistant & Speech Chat
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-free voice companion powered by Cloud Gemini AI and your smartphone's acoustic chamber.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <VolumeX className="w-3.5 h-3.5" />
              Mute Speaker
            </button>
          )}

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            {isListening ? '🎙️ Mic Active' : 'Speaker 90dB Ready'}
          </div>
        </div>
      </div>

      {/* Cat Companion Waveform Animation Strip */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Animated Cat Eye Mini Indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-3.5 h-2.5 rounded-full border transition-all ${
              isSpeaking ? 'bg-cyan-400 border-cyan-200 animate-ping' :
              isListening ? 'bg-amber-400 border-amber-200 animate-pulse' :
              'bg-slate-700 border-slate-600'
            }`} />
            <div className={`w-3.5 h-2.5 rounded-full border transition-all ${
              isSpeaking ? 'bg-cyan-400 border-cyan-200 animate-ping' :
              isListening ? 'bg-amber-400 border-amber-200 animate-pulse' :
              'bg-slate-700 border-slate-600'
            }`} />
          </div>

          <div className="text-xs">
            <span className="font-bold text-white">
              {isListening ? 'Listening to Andres...' : isSpeaking ? 'MAAAOEW Speaking through Cat Base...' : 'Voice Recognition Standby'}
            </span>
            <div className="text-[11px] text-slate-400">
              Speak naturally or tap one of the voice command shortcuts below.
            </div>
          </div>
        </div>

        {/* Audio Waveform Bars */}
        <div className="flex items-center gap-1 h-6">
          {[40, 75, 50, 90, 60, 80, 45].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-amber-400 animate-pulse'
                  : isSpeaking
                  ? 'bg-cyan-400 animate-bounce'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isListening || isSpeaking ? `${height}%` : '20%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Voice Quick Commands Menu (Tap to speak or voice trigger) */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Quick Voice Commands Menu</span>
          <span className="text-[11px] text-cyan-400 font-mono">1-Tap Voice Intent</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleQuickCommand("Dispense my Amlodipine and Losartan dose now")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <Pill className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-cyan-300">
                "Dispense my dose now"
              </div>
              <div className="text-[11px] text-slate-400">Triggers physical mouth drop</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickCommand("Why should I take medication if I feel completely fine today?")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-amber-300">
                "Why take pills if I feel fine?"
              </div>
              <div className="text-[11px] text-slate-400">Combats asymptomatic fallacy</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickCommand("Where is the cheapest pharmacy for my generic refill?")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-emerald-300">
                "Where is the cheapest pharmacy?"
              </div>
              <div className="text-[11px] text-slate-400">Compares generic prices</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickCommand("What is my adherence streak and blood pressure progress?")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <Calendar className="w-4 h-4 text-teal-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-teal-300">
                "Check my adherence streak"
              </div>
              <div className="text-[11px] text-slate-400">Reviews 14-day calendar progress</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickCommand("How does my irregular taxi shift affect my dosing timing?")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-indigo-300">
                "Shift timing advice"
              </div>
              <div className="text-[11px] text-slate-400">Circadian dosing calibration</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickCommand("What is my phone battery charge and dock status?")}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-white group-hover:text-purple-300">
                "Check dock battery power"
              </div>
              <div className="text-[11px] text-slate-400">Reports 15W Qi charging status</div>
            </div>
          </button>
        </div>
      </div>

      {/* Messages Conversation Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-5 max-h-72 overflow-y-auto space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400">
                {msg.sender === 'user' ? 'Andres (Taxi Driver)' : 'MAAAOEW Companion'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}
            </div>

            {msg.actionTriggered && (
              <span className="mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                ✓ Action Executed: {msg.actionTriggered}
              </span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>MAAAOEW is analyzing your health context...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {recognitionError && (
        <div className="text-xs text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{recognitionError}</span>
        </div>
      )}

      {/* Voice Recognition Bar & Text Input */}
      <div className="flex items-center gap-2 pt-1">
        {/* Big Microphone Push-to-Talk Button */}
        <button
          onClick={toggleListening}
          className={`p-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
              : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/20'
          }`}
          title={isListening ? "Listening... Tap to stop" : "Tap to Speak (Voice Recognition)"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input for Typing or Transcript Preview */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={isListening ? "Listening to your voice..." : "Type or speak to MAAAOEW..."}
            className="w-full py-3 pl-4 pr-10 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-3.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 hover:text-cyan-300 rounded-2xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
