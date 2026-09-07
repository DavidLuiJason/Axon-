export type ScreenId =
  | 'axon'
  | 'tools'
  | 'code'
  | 'automation'
  | 'video_editor'
  | 'notes'
  | 'storage'
  | 'settings'
  | 'account'
  | 'notifications'
  | 'tool_text'
  | 'tool_calc'
  | 'tool_units'
  | 'tool_colors'
  | 'tool_images'
  | 'tool_files'
  | 'tool_speech_rate'
  | 'tool_bible';

export type PaneViewState = 'chat-only' | 'split' | 'workspace-only';

export type AIProvider = 'gemini' | 'claude' | 'chatgpt';
export type AICallMode = 'offline' | 'single' | 'multi';

export interface GeneralSettings {
  deleteConfirmationWaitTimerSeconds: number; // default 5, adjustable 0-10
  deleteConfirmationTimerEnabled: boolean; // default true, if false instant deletion
  userReadingSpeedWpm: number; // default 200, user adjustable
  aiCallMode: AICallMode; // 'offline' | 'single' | 'multi'
}

export interface AIAccount {
  id: string;
  provider: AIProvider;
  label: string; // e.g. "Account A", "Account B", "Personal", "Work"
  apiKey: string;
  isActive: boolean;
  isRateLimited: boolean;
  cooldownUntil?: number; // timestamp in ms (up to 24 hours)
  lastError?: string;
  createdAt: string;
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  providerName: string;
  badge: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  systemContext?: string; // Specific instructions, objectives, or guidelines scoped to this project
  color?: string;
  icon?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory =
  | 'general'
  | 'extracted_chat'
  | 'code'
  | 'prompt'
  | 'spec'
  | 'meeting'
  | 'idea'
  | 'architecture';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'axon';
  text: string;
  timestamp: string;
  projectId?: string; // Scoped project ID for per-project memory isolation
  modelUsed?: string;
  accountUsed?: string;
  isRateLimitedNotice?: boolean;
  attachment?: {
    name: string;
    type: string;
    size?: string;
    dataUrl?: string;
  };
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  projectId?: string; // Associated project ID or 'global'
  tags?: string[];
  isPinned?: boolean;
  category?: NoteCategory;
  createdAt: string;
  updatedAt: string;
}

export type IconPreset = 'axon-orb' | 'axon-minimal' | 'axon-neural' | 'axon-cyber';

export interface IconAvatarSettings {
  appIconType: 'preset' | 'custom';
  appIconPreset: IconPreset;
  appIconCustomUrl?: string;

  avatarType: 'preset' | 'custom';
  avatarPreset: IconPreset;
  avatarCustomUrl?: string;
  previousAvatarCustomUrl?: string; // for restorable functionality

  syncAppIconAndAvatar: boolean;
  showChatAvatar: boolean;
}

export type ThemeMode = 'dark' | 'light';

export interface ThemeSettings {
  mode: ThemeMode;
  accentColor: string; // e.g. '#ffffff', '#3b82f6', '#10b981', '#a855f7'
}

export type CodeSkillLevel = 'guided' | 'assisted' | 'developer' | 'expert';

export interface SavedScript {
  id: string;
  title: string;
  code: string;
  language: 'shorthand' | 'javascript' | 'python' | 'html';
  skillLevel: CodeSkillLevel;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface KnowledgePackLesson {
  id: string;
  title: string;
  category: string;
  description: string;
  shorthandCode?: string;
  realCode: string;
  language: 'javascript' | 'python' | 'html' | 'shell';
  explanation: string;
  practicalTip: string;
}

export interface KnowledgePack {
  id: string;
  title: string;
  version: string;
  isBasePack: boolean; // Base pack cannot be deleted
  description: string;
  icon: string;
  lessons: KnowledgePackLesson[];
}

export interface ExecutionResult {
  output: string;
  error?: string;
  returnVal?: any;
  executionTimeMs: number;
  memoryEstimateKb: number;
  timestamp: string;
  renderHtml?: string;
}

export interface TranslatedCommand {
  userQuery: string;
  detectedIntent: string;
  commandOrCode: string;
  language: string;
  explanation: string;
  why: string;
  relatedLessonId?: string;
}

// PART 5: Automation Rules Engine Types
export type RuleTriggerType =
  | 'connection_error'
  | 'model_error'
  | 'rate_limit'
  | 'keyword_match'
  | 'code_execution_error'
  | 'message_sent'
  | 'custom_event';

export type RuleActionType =
  | 'retry_automatically'
  | 'switch_account'
  | 'notify_user'
  | 'auto_format_code'
  | 'execute_run_code'
  | 'append_instruction'
  | 'save_to_notes';

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  triggerType: RuleTriggerType;
  triggerLabel: string;
  triggerCondition: string;
  actionType: RuleActionType;
  actionLabel: string;
  actionConfig: {
    maxRetries?: number;
    targetAccountId?: string;
    targetAccountLabel?: string;
    customMessage?: string;
    runCodeEntryId?: string;
    instructionPayload?: string;
  };
  plainLanguagePrompt?: string;
  creationMode: 'plain_language' | 'guided_form';
  createdAt: string;
  updatedAt: string;
  triggerCount: number;
  lastTriggered?: string;
  lastExecutionLog?: string;
}

// PART 5: Run Code Layer (Live Behavior Extension Layer)
export type RunCodeHookPoint =
  | 'pre_prompt'          // Intercepts and transforms incoming user prompts before API dispatch
  | 'post_response'       // Post-processes AI responses before rendering
  | 'custom_command'      // Intercepts custom slash command (e.g. /stats, /format)
  | 'runtime_interceptor' // System behavior overrides
  | 'standalone';         // Standalone execution script

export interface RunCodeEntry {
  id: string;
  title: string;
  description: string;
  category?: 'prompt_filter' | 'response_modifier' | 'custom_command' | 'behavior_extension' | 'system_override';
  hookPoint: RunCodeHookPoint;
  commandKeyword?: string;
  code: string;
  language?: 'javascript' | 'axon_instructions';
  enabled: boolean;
  author?: string;
  version?: string;
  executionCount: number;
  lastExecuted?: string;
  lastOutput?: string;
  createdAt: string;
  updatedAt: string;
}

// PART 7: Asset Manifest, Compression & Storage Diagnostics Types
export type AssetCategory =
  | 'model'
  | 'knowledge_pack'
  | 'user_file'
  | 'chat_history'
  | 'cache'
  | 'system';

export type SaveMode = 'archive' | 'space_saver';

export type QualityState =
  | 'original'
  | 'lossless'
  | 'downsampled'
  | 'enhanced_approximation';

export type KnowledgeStatus = 'current' | 'stale' | 'not_applicable';

export interface AssetRevertLog {
  timestamp: string;
  action: 'enhanced' | 'reverted_lossless' | 'reverted_approximation' | 'switched_mode';
  note: string;
}

export interface AssetManifestItem {
  id: string;
  name: string;
  category: AssetCategory;
  storageLocation: string; // Exact path/URI: e.g. "/local/models/gemini-flash.bin"
  mimeType: string;
  originalSizeBytes: number; // Exact integer byte count
  storedSizeBytes: number;   // Exact stored byte count
  saveMode: SaveMode;        // 'archive' (lossless original preserved) vs 'space_saver' (lossy/downsampled, original discarded)
  isOriginalPreserved: boolean;
  qualityState: QualityState;
  knowledgeStatus: KnowledgeStatus;
  staleReason?: string;
  description?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  revertHistory?: AssetRevertLog[];
}

export type TrimCategoryPriority =
  | 'cache'
  | 'stale_knowledge'
  | 'downsampled_user_files'
  | 'chat_history'
  | 'knowledge_packs'
  | 'models';

export interface StorageBudgetConfig {
  budgetBytes: number; // Default: 15 GB = 16,106,127,360 bytes
  budgetMode: 'preset_15gb' | 'custom' | 'detected';
  trimPriority: TrimCategoryPriority[];
  warningThresholdPercent: number; // e.g. 85%
  autoTrimOnBudgetNear: boolean;
}

export interface AppStateData {
  settings: {
    theme: ThemeSettings;
    icons: IconAvatarSettings;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    aiAccounts: AIAccount[];
    activeModelId: string;
    codeSkillLevel?: CodeSkillLevel;
    activeProjectId?: string;
    storageBudget?: StorageBudgetConfig;
    generalSettings?: GeneralSettings;
  };
  projects?: ProjectItem[];
  messages: ChatMessage[];
  notes: NoteItem[];
  assetManifest?: AssetManifestItem[];
  userContent: {
    customFiles: Array<{ id: string; name: string; type: string; size: string; date: string }>;
    savedScripts?: SavedScript[];
    automationRules?: AutomationRule[];
    runCodeEntries?: RunCodeEntry[];
  };
}
