import React from 'react';

export type NavigationTab = 'intro' | 'simulator' | 'shifts' | 'casestudy' | 'pharmacy' | 'hardware';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenQuickDispense: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenQuickDispense }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('intro')}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          MAAAOEW
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('intro')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'intro' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Introduction
          </button>
          <button
            onClick={() => onSelectTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulator' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dock Simulator
          </button>
          <button
            onClick={() => onSelectTab('shifts')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'shifts' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Shift Engine
          </button>
          <button
            onClick={() => onSelectTab('casestudy')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'casestudy' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Clinical Evidence
          </button>
          <button
            onClick={() => onSelectTab('pharmacy')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pharmacy' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Pharmacy Portal
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickDispense}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Test Dispense Dose
          </button>
        </div>
      </div>
    </header>
  );
};
