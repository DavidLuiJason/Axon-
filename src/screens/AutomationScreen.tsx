import React, { useState } from 'react';
import {
  Zap,
  Code2,
  Activity,
  Sliders,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RulesEngineView } from '../components/automation/RulesEngineView';
import { RunCodeLayerView } from '../components/automation/RunCodeLayerView';
import { AutomationSimulatorView } from '../components/automation/AutomationSimulatorView';

type AutomationTab = 'rules' | 'runcode' | 'simulator';

export const AutomationScreen: React.FC = () => {
  const {
    automationRules,
    runCodeEntries,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AutomationTab>('rules');

  const activeRulesCount = automationRules.filter((r) => r.enabled).length;
  const activeExtensionsCount = runCodeEntries.filter((e) => e.enabled).length;

  return (
    <div id="automation-screen" className="flex flex-col h-full bg-black text-white">
      {/* Top Info Banner */}
      <div className="px-4 py-3 border-b border-neutral-800/80 bg-neutral-950 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              Automation & Run Code
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-mono">
              Engine Layer
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Conditional triggers and live behavioral extensions
          </p>
        </div>

        {/* Status Indicators */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[11px] flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-white" />
            <span>{activeRulesCount} Active Rules</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3 h-3 text-white" />
            <span>{activeExtensionsCount} Active Extensions</span>
          </div>
        </div>
      </header>

      {/* Segmented Control Bar */}
      <div className="px-4 pt-3 pb-2 border-b border-neutral-900 bg-neutral-950/60 shrink-0">
        <div className="flex p-1 rounded-xl bg-neutral-900 border border-neutral-800/80 max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'rules'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Rules Engine</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'rules' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {automationRules.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('runcode')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'runcode'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Run Code Layer</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'runcode' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {runCodeEntries.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'simulator'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-5xl w-full mx-auto">
        {activeTab === 'rules' && <RulesEngineView onOpenNewRuleModal={() => {}} />}
        {activeTab === 'runcode' && <RunCodeLayerView />}
        {activeTab === 'simulator' && <AutomationSimulatorView />}
      </main>
    </div>
  );
};
