import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Mic,
  MicOff,
  ArrowUp,
  Trash2,
  Paperclip,
  X,
  Sparkles,
  ChevronDown,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Image as ImageIcon,
  Folder,
  BookmarkPlus,
  Download,
  FileDown,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AxonLogo } from './AxonLogo';
import { ModelSelectorModal } from './ModelSelectorModal';
import { isAccountInCooldown, getRemainingCooldownString } from '../lib/aiConfig';

export const ChatPane: React.FC = () => {
  const {
    activeProjectMessages,
    activeProject,
    addMessage,
    deleteMessage,
    clearMessages,
    icons,
    availableModels,
    activeModelId,
    aiAccounts,
    isGeneratingResponse,
    showToast,
    extractConversationToNote,
    extractSingleMessageToNote,
    exportConversationToFile,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Conversation extraction menu
  const [isExtractMenuOpen, setIsExtractMenuOpen] = useState(false);
  const [isExtractingNote, setIsExtractingNote] = useState(false);
  const extractMenuRef = useRef<HTMLDivElement>(null);

  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    size?: string;
    dataUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentModel = availableModels.find((m) => m.id === activeModelId) || availableModels[0];
  const activeAccount = aiAccounts.find(
    (a) => a.provider === currentModel.provider && a.isActive
  );
  const isCooldownActive = isAccountInCooldown(activeAccount);
  const cooldownString = getRemainingCooldownString(activeAccount);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeProjectMessages, isGeneratingResponse]);

  // Click outside to close extract dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (extractMenuRef.current && !extractMenuRef.current.contains(e.target as Node)) {
        setIsExtractMenuOpen(false);
      }
    };
    if (isExtractMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExtractMenuOpen]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!inputVal.trim() && !attachedFile) return;

    addMessage(inputVal.trim(), attachedFile || undefined);
    setInputVal('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dataUrl,
      });
      showToast(`Attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('Voice mode paused');
    } else {
      setIsRecording(true);
      showToast('Voice listening active (Voice module coming in future update)');
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleExtractSummary = async () => {
    setIsExtractMenuOpen(false);
    setIsExtractingNote(true);
    await extractConversationToNote({ mode: 'summary' });
    setIsExtractingNote(false);
  };

  const handleExtractFull = async () => {
    setIsExtractMenuOpen(false);
    setIsExtractingNote(true);
    await extractConversationToNote({ mode: 'raw' });
    setIsExtractingNote(false);
  };

  const handleExportFile = (format: 'markdown' | 'text' | 'json') => {
    setIsExtractMenuOpen(false);
    exportConversationToFile(format);
  };

  return (
    <div
      id="chat-pane"
      className="flex flex-col h-full bg-black text-white select-text overflow-hidden relative"
    >
      {/* Model & Account Quick-Switch Header with Project Context & Export */}
      <div
        id="chat-model-bar"
        className="px-3 py-2 bg-neutral-950/95 border-b border-neutral-900 flex items-center justify-between z-10 select-none backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setIsModelModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 transition-all text-left group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white group-hover:text-neutral-200">
              {currentModel.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-750">
              {activeAccount?.label || 'Account A'}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors ml-0.5" />
        </button>

        <div className="flex items-center gap-2">
          {isCooldownActive && (
            <button
              type="button"
              onClick={() => setIsModelModalOpen(true)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>Cooldown: {cooldownString}</span>
            </button>
          )}

          {/* Project Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeProject.color || '#ffffff' }}
            />
            <span className="font-medium truncate max-w-[120px]">{activeProject.name}</span>
          </div>

          {/* Export / Extract Dropdown Menu */}
          <div className="relative" ref={extractMenuRef}>
            <button
              id="chat-export-menu-btn"
              type="button"
              onClick={() => setIsExtractMenuOpen(!isExtractMenuOpen)}
              disabled={isExtractingNote || activeProjectMessages.length === 0}
              title="Export conversation or save to Project Notes"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
            >
              {isExtractingNote ? (
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {isExtractMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Save to Notes
                </div>
                <button
                  type="button"
                  onClick={handleExtractSummary}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 text-white flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <div>
                    <div className="font-medium">AI Executive Summary</div>
                    <div className="text-[10px] text-neutral-500">Key insights & decisions</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleExtractFull}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 text-white flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <div>
                    <div className="font-medium">Full Transcript Note</div>
                    <div className="text-[10px] text-neutral-500">Verbatim project record</div>
                  </div>
                </button>

                <div className="my-1 border-t border-neutral-800/80" />

                <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Download File
                </div>
                <button
                  type="button"
                  onClick={() => handleExportFile('markdown')}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportFile('text')}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Plain Text (.txt)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportFile('json')}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 text-neutral-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Raw JSON (.json)</span>
                </button>

                <div className="my-1 border-t border-neutral-800/80" />

                <button
                  type="button"
                  onClick={() => {
                    setIsExtractMenuOpen(false);
                    clearMessages();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Clear Conversation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages stream */}
      <div
        id="chat-messages-container"
        className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4"
      >
        {activeProjectMessages.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div
              className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center border"
              style={{
                borderColor: `${activeProject.color || '#ffffff'}40`,
                backgroundColor: `${activeProject.color || '#ffffff'}10`,
              }}
            >
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Workspace: {activeProject.name}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                {activeProject.description || 'All messages and memories here are isolated to this project.'}
              </p>
            </div>
            <p className="text-[11px] text-neutral-500">
              Send a prompt below to start building or problem-solving.
            </p>
          </div>
        ) : (
          activeProjectMessages.map((msg) => {
            const isAxon = msg.sender === 'axon';

            return (
              <div
                key={msg.id}
                id={`chat-message-${msg.id}`}
                className={`flex items-start gap-2.5 group ${
                  isAxon ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* AI Avatar next to AXON's messages */}
                {isAxon && (
                  <div className="shrink-0 mt-0.5">
                    <AxonLogo
                      size={30}
                      preset={icons.avatarType === 'preset' ? icons.avatarPreset : undefined}
                      customUrl={icons.avatarType === 'custom' ? icons.avatarCustomUrl : undefined}
                      glow={false}
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isAxon
                      ? 'bg-neutral-900/90 text-neutral-100 border border-neutral-800 rounded-tl-sm'
                      : 'bg-white text-black font-normal rounded-tr-sm shadow-md'
                  }`}
                >
                  {/* Optional Attachment Preview */}
                  {msg.attachment && (
                    <div
                      className={`mb-2 p-2 rounded-xl flex items-center gap-2 border text-xs ${
                        isAxon
                          ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      {msg.attachment.type.startsWith('image/') && msg.attachment.dataUrl ? (
                        <img
                          src={msg.attachment.dataUrl}
                          alt={msg.attachment.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <Paperclip className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                      <div className="truncate flex-1">
                        <p className="font-medium truncate">{msg.attachment.name}</p>
                        {msg.attachment.size && (
                          <p className="text-[10px] opacity-70">{msg.attachment.size}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] opacity-60">
                    <span>{msg.timestamp}</span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Copy text */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        title="Copy text"
                        className="p-1 rounded hover:bg-neutral-800/40 transition-colors"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Extract single message to note */}
                      <button
                        type="button"
                        onClick={() => extractSingleMessageToNote(msg.id)}
                        title="Save message to Project Notes"
                        className="p-1 rounded hover:bg-neutral-800/40 text-neutral-400 hover:text-white transition-colors"
                      >
                        <BookmarkPlus className="w-3 h-3" />
                      </button>

                      {/* Delete button: only for user messages */}
                      {!isAxon && (
                        <button
                          type="button"
                          onClick={() => deleteMessage(msg.id)}
                          title="Delete message"
                          className="p-1 text-neutral-600 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic Thinking / Generating Indicator */}
        {isGeneratingResponse && (
          <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="shrink-0 mt-0.5">
              <AxonLogo
                size={30}
                preset={icons.avatarType === 'preset' ? icons.avatarPreset : undefined}
                customUrl={icons.avatarType === 'custom' ? icons.avatarCustomUrl : undefined}
                glow={true}
              />
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs text-neutral-300">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              </div>
              <span className="text-neutral-400 ml-1.5 font-mono text-[11px]">
                {currentModel.name} generating response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Usage Limit Cooldown Warning Banner if active */}
      {isCooldownActive && (
        <div
          id="chat-cooldown-alert"
          className="mx-3 mb-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {activeAccount?.label} reached API limit ({cooldownString}). AXON will not auto-switch.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModelModalOpen(true)}
            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 text-[11px] font-semibold transition-colors shrink-0"
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Voice Recording Banner if active */}
      {isRecording && (
        <div
          id="voice-recording-banner"
          className="mx-3 mb-2 p-2.5 rounded-xl bg-neutral-900 border border-red-500/40 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-2 text-xs text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-medium">Listening ({recordingSeconds}s)...</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoice}
            className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
          >
            Stop
          </button>
        </div>
      )}

      {/* Attachment Draft Pill if user selected an image/file */}
      {attachedFile && (
        <div
          id="chat-attached-file-pill"
          className="mx-3 mb-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            {attachedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-4 h-4 text-neutral-400" />
            ) : (
              <Paperclip className="w-4 h-4 text-neutral-400" />
            )}
            <span className="truncate max-w-[200px] text-neutral-200">{attachedFile.name}</span>
            <span className="text-[10px] text-neutral-500">{attachedFile.size}</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachedFile(null)}
            className="p-1 text-neutral-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Input Bar at the bottom */}
      <div
        id="chat-input-bar"
        className="p-3 bg-neutral-950/90 border-t border-neutral-900 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-2xl px-2 py-1.5 focus-within:border-neutral-600 transition-colors">
          {/* Attach / + Button */}
          <button
            id="chat-attach-btn"
            type="button"
            onClick={handleAttachClick}
            aria-label="Attach file or image"
            title="Attach file"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            id="chat-input-field"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${currentModel.name} in ${activeProject.name}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none min-w-0 px-1 py-1"
          />

          {/* Microphone Icon Button */}
          <button
            id="chat-mic-btn"
            type="button"
            onClick={handleToggleVoice}
            aria-label={isRecording ? 'Mute microphone' : 'Voice input'}
            title={isRecording ? 'Stop Voice' : 'Voice Input'}
            className={`p-2 rounded-xl transition-all active:scale-95 ${
              isRecording
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Distinct Send/Action Button */}
          <button
            id="chat-send-btn"
            type="button"
            onClick={handleSendMessage}
            disabled={(!inputVal.trim() && !attachedFile) || isGeneratingResponse}
            aria-label="Send message"
            className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              (inputVal.trim() || attachedFile) && !isGeneratingResponse
                ? 'bg-white text-black active:scale-95 shadow-md hover:bg-neutral-200'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model & Account Switching Modal */}
      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
};
