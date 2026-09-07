import { AIModelOption, AIAccount, AIProvider } from '../types';

export const AVAILABLE_AI_MODELS: AIModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    providerName: 'Google Gemini',
    badge: 'Fast & Direct',
    description: 'Latest standard high-speed reasoning model with low latency.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    provider: 'gemini',
    providerName: 'Google Gemini',
    badge: 'Deep Reasoning',
    description: 'Advanced problem solving, architecture, and code synthesis.',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    providerName: 'Anthropic Claude',
    badge: 'Nuanced Prose',
    description: 'Calibrated conversational depth, analysis, and concise clarity.',
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    providerName: 'Anthropic Claude',
    badge: 'Ultra Fast',
    description: 'Lightweight and ultra-responsive for rapid mobile interactions.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'chatgpt',
    providerName: 'OpenAI ChatGPT',
    badge: 'Flagship Omni',
    description: 'Versatile multimodal intelligence and conversational capabilities.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'chatgpt',
    providerName: 'OpenAI ChatGPT',
    badge: 'Compact & Quick',
    description: 'Fast, cost-effective assistance with lightweight resource footprint.',
  },
];

export const DEFAULT_AI_ACCOUNTS: AIAccount[] = [
  {
    id: 'acc-gemini-a',
    provider: 'gemini',
    label: 'Account A (Primary)',
    apiKey: '',
    isActive: true,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
  {
    id: 'acc-gemini-b',
    provider: 'gemini',
    label: 'Account B',
    apiKey: '',
    isActive: false,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
  {
    id: 'acc-claude-a',
    provider: 'claude',
    label: 'Account A',
    apiKey: '',
    isActive: true,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
  {
    id: 'acc-claude-b',
    provider: 'claude',
    label: 'Account B',
    apiKey: '',
    isActive: false,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
  {
    id: 'acc-chatgpt-a',
    provider: 'chatgpt',
    label: 'Account A',
    apiKey: '',
    isActive: true,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
  {
    id: 'acc-chatgpt-b',
    provider: 'chatgpt',
    label: 'Account B',
    apiKey: '',
    isActive: false,
    isRateLimited: false,
    createdAt: '2026-09-06',
  },
];

export function isAccountInCooldown(account?: AIAccount): boolean {
  if (!account || !account.isRateLimited || !account.cooldownUntil) return false;
  return Date.now() < account.cooldownUntil;
}

export function getRemainingCooldownString(account?: AIAccount): string {
  if (!account || !account.cooldownUntil) return '';
  const diffMs = account.cooldownUntil - Date.now();
  if (diffMs <= 0) return 'Cooldown expired';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return `${hours}h ${mins}m remaining`;
  }
  return `${mins}m remaining`;
}

export function findAccountByLabel(
  accounts: AIAccount[],
  query: string,
  preferredProvider?: AIProvider
): AIAccount | undefined {
  const q = query.toLowerCase().trim();

  // First, search in preferredProvider
  if (preferredProvider) {
    const match = accounts.find((a) => a.provider === preferredProvider && a.label.toLowerCase().includes(q));
    if (match) return match;
    const exactMatch = accounts.find(
      (a) => a.provider === preferredProvider && (a.id.toLowerCase() === q || a.label.toLowerCase() === q)
    );
    if (exactMatch) return exactMatch;
  }

  // Next, search globally
  return (
    accounts.find((a) => a.label.toLowerCase().includes(q)) ||
    accounts.find((a) => a.id.toLowerCase() === q || a.label.toLowerCase() === q)
  );
}
