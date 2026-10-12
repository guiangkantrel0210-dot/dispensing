import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'intro' | 'simulator' | 'shifts' | 'casestudy' | 'pharmacy' | 'hardware') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold text-white tracking-tight">MAAAOEW</div>
          <p className="text-slate-500">
            Medication Adherence Artificial-Intelligent Assistant for Optimal Efficacy · Activity 9.3 Dispensing 2
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button onClick={() => onSelectTab('intro')} className="hover:text-white transition-colors">
            Introduction
          </button>
          <button onClick={() => onSelectTab('simulator')} className="hover:text-white transition-colors">
            Dock Simulator
          </button>
          <button onClick={() => onSelectTab('shifts')} className="hover:text-white transition-colors">
            Shift Engine
          </button>
          <button onClick={() => onSelectTab('casestudy')} className="hover:text-white transition-colors">
            Case Study (Mr. Gonzales)
          </button>
          <button onClick={() => onSelectTab('pharmacy')} className="hover:text-white transition-colors">
            Clinic Portal
          </button>
          <button onClick={() => onSelectTab('hardware')} className="hover:text-white transition-colors">
            Hardware Specs
          </button>
        </nav>

        <div className="text-slate-600 text-center md:text-right font-mono">
          Clinical Reference: PMC3869130 / PMC6843901
        </div>
      </div>
    </footer>
  );
};
