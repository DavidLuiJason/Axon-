import React, { useRef, useState } from 'react';
import {
  Moon,
  Sun,
  Palette,
  Image as ImageIcon,
  RotateCcw,
  Undo2,
  Trash2,
  Upload,
  Check,
  User,
  Bell,
  Download,
  UploadCloud,
  ChevronRight,
  Shield,
  Smartphone,
  HardDrive,
  Key,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AxonLogo } from '../components/AxonLogo';
import { AIAccountsSettings } from '../components/AIAccountsSettings';
import { IconPreset } from '../types';
import { formatBytes } from '../lib/storageManifest';

export const SettingsScreen: React.FC = () => {
  const {
    theme,
    setThemeMode,
    setAccentColor,
    icons,
    setAppIconPreset,
    setAppIconCustom,
    setAvatarPreset,
    setAvatarCustom,
    removeAvatar,
    restoreAvatar,
    setSyncAppIconAndAvatar,
    navigateTo,
    requestConfirmation,
    exportStateJson,
    importStateJson,
    resetAllData,
    storageBreakdown,
    storageBudget,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai' | 'appearance' | 'system'>('ai');

  const appIconFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  // Preset choices for icons & avatars
  const presets: Array<{ id: IconPreset; name: string; desc: string }> = [
    { id: 'axon-orb', name: 'Luminous Orb', desc: 'Signature glowing core' },
    { id: 'axon-minimal', name: 'Minimal Monogram', desc: 'Sharp typography' },
    { id: 'axon-neural', name: 'Neural Synapse', desc: 'Constellation network' },
    { id: 'axon-cyber', name: 'Cyber Prism', desc: 'Futuristic geometry' },
  ];

  const handleCustomAppIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAppIconCustom(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarCustom(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Delete custom app icon with mandatory confirmation prompt
  const handleDeleteCustomAppIcon = () => {
    requestConfirmation({
      title: 'Remove Custom App Icon',
      message: 'Are you sure you want to delete this custom app icon and revert to the default?',
      confirmLabel: 'Revert Icon',
      danger: true,
      onConfirm: () => {
        setAppIconPreset('axon-orb');
        showToast('App icon reverted to default');
      },
    });
  };

  // Delete custom avatar with mandatory confirmation prompt
  const handleDeleteCustomAvatar = () => {
    requestConfirmation({
      title: 'Remove Chat Avatar',
      message: 'Are you sure you want to delete this custom avatar and revert to the default?',
      confirmLabel: 'Revert Avatar',
      danger: true,
      onConfirm: () => {
        removeAvatar();
      },
    });
  };

  // Export JSON file download
  const handleExportData = () => {
    const jsonStr = exportStateJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axon-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup exported');
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
        importStateJson(content);
      } catch (err) {
        showToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      id="settings-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-4 select-none"
    >
      <div className="max-w-md mx-auto space-y-6 pb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Settings</h2>
          <p className="text-xs text-neutral-400">
            Multi-AI keys, model routing, appearance, and backup storage
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-2xl border border-neutral-800">
          <button
            id="settings-tab-ai"
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>AI Accounts</span>
          </button>
          <button
            id="settings-tab-appearance"
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'appearance'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>
          <button
            id="settings-tab-system"
            type="button"
            onClick={() => setActiveTab('system')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'system'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>

        {/* TAB 1: AI Accounts & Keys */}
        {activeTab === 'ai' && <AIAccountsSettings />}

        {/* TAB 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-5">
        {/* SECTION 1: Theme & Visual Design */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-300" />
            <h3 className="text-sm font-semibold text-white">Visual Design & Theme</h3>
          </div>

          {/* Light / Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-200">Theme Mode</p>
              <p className="text-[11px] text-neutral-400">
                Claude-inspired high-contrast dark aesthetic
              </p>
            </div>
            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  theme.mode === 'dark'
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  theme.mode === 'light'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Accent Color Swatches */}
          <div className="pt-2 border-t border-neutral-800/80">
            <p className="text-xs font-medium text-neutral-200 mb-2">Accent Highlight</p>
            <div className="flex items-center gap-2.5">
              {[
                { hex: '#ffffff', name: 'Monochrome White' },
                { hex: '#3b82f6', name: 'Cyber Blue' },
                { hex: '#10b981', name: 'Emerald' },
                { hex: '#a855f7', name: 'Violet' },
                { hex: '#f59e0b', name: 'Amber' },
              ].map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => setAccentColor(swatch.hex)}
                  title={swatch.name}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                    theme.accentColor === swatch.hex
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {theme.accentColor === swatch.hex && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        swatch.hex === '#ffffff' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: App Icon System */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-neutral-300" />
              <div>
                <h3 className="text-sm font-semibold text-white">App Icon</h3>
                <p className="text-[11px] text-neutral-400">Launcher identity on phone home screen</p>
              </div>
            </div>
            {/* Live Preview of current App Icon */}
            <div className="p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
              <AxonLogo
                size={42}
                preset={icons.appIconType === 'preset' ? icons.appIconPreset : undefined}
                customUrl={icons.appIconType === 'custom' ? icons.appIconCustomUrl : undefined}
              />
            </div>
          </div>

          {/* Built-in Preset selector */}
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-300 font-medium">Built-in Icon Styles</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => {
                const isSelected =
                  icons.appIconType === 'preset' && icons.appIconPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAppIconPreset(p.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-white text-white shadow-sm'
                        : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <AxonLogo size={28} preset={p.id} glow={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Custom App Icon from Gallery */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <input
              ref={appIconFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomAppIconUpload}
            />

            <button
              id="upload-app-icon-btn"
              type="button"
              onClick={() => appIconFileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose from Gallery</span>
            </button>

            {icons.appIconType === 'custom' && (
              <button
                id="revert-app-icon-btn"
                type="button"
                onClick={handleDeleteCustomAppIcon}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revert to Default</span>
              </button>
            )}
          </div>
        </div>

        {/* SECTION 3: Chat Avatar System (SEPARATE from App Icon) */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-300" />
              <div>
                <h3 className="text-sm font-semibold text-white">Chat Avatar</h3>
                <p className="text-[11px] text-neutral-400">
                  Profile picture displayed next to AXON AI messages
                </p>
              </div>
            </div>
            {/* Live Preview of current Chat Avatar */}
            <div className="p-1 rounded-full bg-neutral-950 border border-neutral-800">
              <AxonLogo
                size={38}
                preset={icons.avatarType === 'preset' ? icons.avatarPreset : undefined}
                customUrl={icons.avatarType === 'custom' ? icons.avatarCustomUrl : undefined}
              />
            </div>
          </div>

          {/* Sync Switch: "Use the same image for both app icon and avatar" */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">
                Use same image for icon & avatar
              </p>
              <p className="text-[11px] text-neutral-400">
                Synchronizes current app icon and chat avatar
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="sync-icon-avatar-toggle"
                type="checkbox"
                checked={icons.syncAppIconAndAvatar}
                onChange={(e) => setSyncAppIconAndAvatar(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>

          {/* Built-in Avatar styles if independent */}
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-300 font-medium">Built-in Avatar Styles</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => {
                const isSelected =
                  icons.avatarType === 'preset' && icons.avatarPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAvatarPreset(p.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-white text-white shadow-sm'
                        : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <AxonLogo size={26} preset={p.id} glow={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload, Remove, and Restore Avatar actions */}
          <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center gap-2">
            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomAvatarUpload}
            />

            <button
              id="upload-avatar-btn"
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gallery Avatar</span>
            </button>

            {/* Revert / Remove avatar to default */}
            {icons.avatarType === 'custom' && (
              <button
                id="remove-avatar-btn"
                type="button"
                onClick={handleDeleteCustomAvatar}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs text-neutral-300 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Default</span>
              </button>
            )}

            {/* Restore previously removed custom avatar */}
            {icons.avatarType === 'preset' && icons.previousAvatarCustomUrl && (
              <button
                id="restore-avatar-btn"
                type="button"
                onClick={restoreAvatar}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs text-neutral-200 hover:text-white bg-neutral-850 hover:bg-neutral-750 border border-neutral-700 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Restore Custom Avatar</span>
              </button>
            )}
          </div>
        </div>
          </div>
        )}

        {/* TAB 3: System & Storage */}
        {activeTab === 'system' && (
          <div className="space-y-5">
        {/* SECTION 4: Placeholder sections for Account & Notifications */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-2 space-y-1">
          <button
            id="settings-account-row"
            type="button"
            onClick={() => navigateTo('account')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/80 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300 group-hover:text-white">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Account</p>
                <p className="text-[11px] text-neutral-400">
                  Local device profile & cloud sync setup
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
          </button>

          <button
            id="settings-notifications-row"
            type="button"
            onClick={() => navigateTo('notifications')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/80 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300 group-hover:text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Notifications</p>
                <p className="text-[11px] text-neutral-400">
                  Status alerts & low-latency sound cues
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
          </button>
        </div>

        {/* SECTION 5: Storage, Backup & Export (Fulfilling low-spec device & clean data separation mandate) */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-neutral-300" />
              <div>
                <h3 className="text-sm font-semibold text-white">Storage Diagnostics & Manifest</h3>
                <p className="text-[11px] text-neutral-400">
                  {formatBytes(storageBreakdown.totalStoredBytes)} used of {formatBytes(storageBudget.budgetBytes, 0)} budget
                </p>
              </div>
            </div>
            <button
              id="settings-open-storage-diagnostics-btn"
              type="button"
              onClick={() => navigateTo('storage')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Manage Storage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400 text-[11px]">Active Tracking Mode</span>
              <div className="font-semibold text-white mt-0.5">
                Lossless Archive (Default) + Space-Saver Opt-In
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/60">
              {Math.round((1 - storageBreakdown.overallCompressionRatio) * 100)}% compressed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="export-workspace-backup-btn"
              type="button"
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              id="import-workspace-backup-btn"
              type="button"
              onClick={() => restoreFileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Restore JSON</span>
            </button>

            <input
              ref={restoreFileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">Factory State</span>
            <button
              id="reset-all-data-btn"
              type="button"
              onClick={resetAllData}
              className="text-xs text-red-400 hover:text-red-300 hover:underline"
            >
              Reset All Workspace Data
            </button>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
};
