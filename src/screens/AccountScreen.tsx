import React from 'react';
import {
  User,
  Shield,
  Smartphone,
  HardDrive,
  Sparkles,
  CheckCircle2,
  Key,
  Clock,
  AlertTriangle,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AxonLogo } from '../components/AxonLogo';
import { isAccountInCooldown, getRemainingCooldownString } from '../lib/aiConfig';

export const AccountScreen: React.FC = () => {
  const { icons, aiAccounts, availableModels, activeModelId, navigateTo, clearCooldown } = useApp();

  const currentModel = availableModels.find((m) => m.id === activeModelId) || availableModels[0];

  return (
    <div
      id="account-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-4 select-none"
    >
      <div className="max-w-md mx-auto space-y-4 pb-8">
        {/* Profile Card */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 text-center space-y-3">
          <div className="inline-flex p-1 rounded-full bg-neutral-950 border border-neutral-800">
            <AxonLogo
              size={56}
              preset={icons.avatarType === 'preset' ? icons.avatarPreset : undefined}
              customUrl={icons.avatarType === 'custom' ? icons.avatarCustomUrl : undefined}
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Local Workspace Host</h2>
            <p className="text-xs text-neutral-400 font-mono">device-id: axon-local-01</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Offline Workspace</span>
          </div>
        </div>

        {/* AI Model & Accounts Overview */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-300" />
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Active AI Accounts & Models
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('settings')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Manage Keys</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Current Responding Model</span>
              <span className="font-semibold text-white">{currentModel.name}</span>
            </div>
            <p className="text-[11px] text-neutral-500">{currentModel.providerName} • Official API</p>
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-[11px] text-neutral-400 font-medium">Configured Account Slots</p>
            <div className="space-y-1.5">
              {aiAccounts.map((account) => {
                const inCooldown = isAccountInCooldown(account);
                const cooldownStr = getRemainingCooldownString(account);

                return (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{account.label}</span>
                        <span className="text-[10px] text-neutral-400 uppercase">
                          ({account.provider})
                        </span>
                        {account.isActive && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      {inCooldown ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Cooldown ({cooldownStr})
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500">
                          {account.apiKey ? 'Key Configured' : 'No Key / Default'}
                        </span>
                      )}
                    </div>

                    {inCooldown && (
                      <button
                        type="button"
                        onClick={() => clearCooldown(account.id)}
                        className="px-2 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Device Profile Specs */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Target Device Profile
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="flex items-center gap-2 text-neutral-300">
                <Smartphone className="w-4 h-4 text-neutral-400" />
                <span>Memory Allocation</span>
              </span>
              <span className="font-mono text-white">4 GB RAM (Optimized)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="flex items-center gap-2 text-neutral-300">
                <HardDrive className="w-4 h-4 text-neutral-400" />
                <span>Storage Footprint</span>
              </span>
              <span className="font-mono text-white">64 GB Budget Limit</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="flex items-center gap-2 text-neutral-300">
                <Shield className="w-4 h-4 text-neutral-400" />
                <span>Cloud Sync & Auth</span>
              </span>
              <span className="text-[11px] text-neutral-500">Reserved for Future Phase</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 text-xs text-neutral-400 leading-relaxed">
          <p className="font-semibold text-neutral-200 mb-1">Account & Sync Architecture</p>
          <p>
            Cloud synchronization, multi-device handoff, and identity authentication will be enabled
            in upcoming modular prompts without breaking your local data.
          </p>
        </div>
      </div>
    </div>
  );
};
