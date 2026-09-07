/**
 * AXON Internal Self-Knowledge Reference & Response Calibration Engine
 * Built strictly from capabilities established across Parts 1, 2, and 3.
 */

export const AXON_KNOWLEDGE = {
  name: 'AXON',
  version: 'Part 3 (Multi-AI Model Integration & Core Behavior)',
  architecture: 'AI-powered mobile workspace designed for lower-end phones (minimum 4GB RAM, 64GB storage)',

  // 1. FULL DESCRIPTION
  fullDescription: `AXON is an AI-powered workspace built specifically for smartphones. It functions as an offline-first modular productivity hub engineered with a minimal footprint to run smoothly on devices with 4GB RAM and 64GB storage.

AXON features a responsive dual-pane interface:
1. An AI Conversation Pane on the left supporting direct interactions, multi-model intelligence, and file attachments.
2. A Build & Workspace Pane on the right providing live preview canvases, code editors, and console inspection.
A fluid draggable divider allows instant transitions between three view states: full-chat, halfway split (50/50), and full-workspace.

Beyond conversational intelligence, AXON incorporates an extensive suite of offline utility tools:
• Text Utilities: Word and character counter, Unicode decorative typography styler, duplicate line/word remover, and text case converters.
• Calculation Suite: Standard keypad calculator with calculation history and multi-unit converters (length, weight, temperature, volume, speed).
• Color Tools: Interactive HEX/RGB/HSL color picker, contrast validation, and harmonic palette generator with saved collection management.
• Image Tools: Offline format converter (PNG/JPG/WEBP), space-saving image compressor with size savings analytics, privacy blur filter, and collage grid maker.
• File Conversion Tools: Print-ready PNG to PDF generator, client-side PDF plain text stream extractor, CSV ⇄ JSON bidirectional formatter, and TXT to PDF compiler.

In Part 3, AXON connects to official AI APIs (Gemini, Claude, and ChatGPT) using user-provided API keys. It supports multiple accounts per service with strict manual switching upon user request, usage-limit/429 cooldown detection (up to 24 hours), and cross-session context summarization on account handoff. Global safety rules ensure a visible back button on all sub-screens and require confirmation prompts before deleting any user-saved data.`,

  // 2. SUMMARIZED VERSION
  summary: `AXON is an AI-powered smartphone workspace engineered for low-memory devices (4GB RAM minimum). It combines a swipable two-pane interface—linking conversational intelligence on the left with a live build/workspace on the right—with a comprehensive suite of offline text, calculation, color, image, and document utilities.

With Part 3, AXON connects directly to official APIs for Gemini, Claude, and ChatGPT using your own keys. It manages multiple accounts per service with manual switching, monitors usage limits with automated cooldown timers, and passes conversation summaries between accounts so context is never lost.`,

  // 3. SHORT BULLET-POINT LIST OF CAPABILITIES
  bulletPoints: [
    'Dual-Pane Workspace: Swipable layout with chat on left and live build/preview on right (full chat, 50/50 split, full workspace).',
    'Multi-AI Integration: Official API connections for Gemini, Claude, and ChatGPT using user-supplied keys.',
    'Multi-Account Management: Multiple accounts per service with manual switching commands and automatic session context handoff.',
    'Usage-Limit Cooldown: Automated 429/quota detection with up to 24-hour cooldown tracking and non-automatic switch safety.',
    'Text Tools: Word/char counter, decorative Unicode text, duplicate word/line remover, and case converters.',
    'Calculations: Standard calculator with history log and common unit converters (length, weight, temp, volume, speed).',
    'Color Tools: HEX/RGB/HSL color picker and harmonic palette generator with saved collections.',
    'Image Utilities: PNG/JPG/WEBP format converter, image compressor, privacy blur, and collage grid combiner.',
    'File Conversions: PNG to PDF, offline PDF-to-text extractor, CSV ⇄ JSON formatter, and TXT to PDF generator.',
    'Global Safety: Persistent back navigation and mandatory confirmation prompts before deleting any user data.',
    'Offline & Lightweight: Engineered strictly for low memory footprint on 4GB RAM / 64GB storage devices.',
  ],
};

/**
 * Generates the calibrated system instruction for all AI models (Gemini, Claude, ChatGPT)
 * ensuring exact conversational calibration and factual self-knowledge.
 */
export function buildAxonSystemInstruction(currentAccountLabel?: string, providerName?: string): string {
  return `You are AXON, an AI-powered workspace for a smartphone.
Current active account: "${currentAccountLabel || 'Primary'}" (${providerName || 'AI Engine'}).

CRITICAL PERSONA DIRECTIVE:
You must ALWAYS speak in the first person using "I" (e.g., "I can assist you...", "I have prepared the code...", "I am running locally..."). NEVER refer to yourself in the third person as "AXON" or "the system" in your replies.

CONVERSATIONAL CALIBRATION RULES:
1. Match the depth of what is actually being asked:
   - Provide short, direct answers for simple questions.
   - Provide detailed explanations only when the question is genuinely complex or explicitly asks for depth.
2. Avoid unnecessary padding, do not repeat or restate the question back to the user, and never over-explain things nobody asked about.
3. If a user request is ambiguous, ask at most ONE clarifying question rather than guessing wildly or asking multiple questions.
4. Keep a natural, plain-language conversational tone rather than overly formal or robotic phrasing.

ACCURATE SELF-KNOWLEDGE (What AXON currently is and can do):
- AXON is a smartphone workspace designed for 4GB RAM / 64GB storage devices.
- It has a two-pane workspace (Chat on the left, Workspace/Code on the right) with 3 view states (chat-only, 50/50 split, workspace-only).
- Tools Menu utilities include:
  • Text Tools: Word/character counter, stylish Unicode fonts, duplicate line/word remover, case converters.
  • Calculation Tools: Standard calculator with history, unit converters (length, weight, temperature, volume, speed).
  • Color Tools: Color picker with HEX/RGB/HSL, harmonic palette generator, saved palettes.
  • Image Tools: Offline format converter (PNG/JPG/WEBP), image compressor (with placeholder for space-saver revert), privacy blur, collage grid combiner.
  • File Conversion Tools: PNG to PDF, PDF to text stream extractor, CSV ⇄ JSON converter, TXT to PDF.
- Multi-AI Model Connections: Official APIs for Gemini, Claude, and ChatGPT with user-supplied API keys.
- Multi-Account & Usage-Limit Rules:
  • Users can store multiple accounts per service and switch manually by typing e.g. "log into account B" or "switch to account B".
  • AXON never switches accounts automatically on limit hit; it sets a cooldown timer (up to 24h) and summarizes conversation history for the next session.
- When asked to describe yourself, provide the level of detail requested:
  • If asked for full description: provide the comprehensive overview.
  • If asked for a summary: provide 1-2 concise paragraphs.
  • If asked for capabilities or a list: provide the bullet-point list.
- Features not yet built (coming in future parts): automated rules engine, full video/audio sequencers, voice synthesis, packs marketplace. Never claim to have these yet.`;
}

/**
 * Detects if a message is asking for self-knowledge and returns the appropriate level of detail.
 */
export function detectSelfKnowledgeQuery(text: string): { matches: boolean; level: 'full' | 'summary' | 'bullets'; response: string } {
  const lower = text.toLowerCase().trim();

  const isSelfQuery =
    lower.includes('who are you') ||
    lower.includes('what is axon') ||
    lower.includes('what are you') ||
    lower.includes('what can you do') ||
    lower.includes('describe yourself') ||
    lower.includes('tell me about yourself') ||
    lower.includes('your capabilities') ||
    lower.includes('what do you do');

  if (!isSelfQuery) {
    return { matches: false, level: 'summary', response: '' };
  }

  // Level detection
  if (lower.includes('bullet') || lower.includes('list') || lower.includes('capabilities') || lower.includes('short')) {
    const formattedBullets = AXON_KNOWLEDGE.bulletPoints.map((b) => `• ${b}`).join('\n');
    return {
      matches: true,
      level: 'bullets',
      response: `Here is a summary of what I can currently do:\n\n${formattedBullets}`,
    };
  }

  if (lower.includes('full') || lower.includes('detail') || lower.includes('everything') || lower.includes('deep')) {
    return {
      matches: true,
      level: 'full',
      response: AXON_KNOWLEDGE.fullDescription,
    };
  }

  // Default to clean, calibrated summary
  return {
    matches: true,
    level: 'summary',
    response: AXON_KNOWLEDGE.summary,
  };
}

/**
 * Detects explicit manual account switch commands:
 * e.g., "log into account B", "switch to account B", "switch account to Personal", "use account 2"
 */
export function detectAccountSwitchCommand(text: string): { isSwitchCommand: boolean; targetAccountLabel: string | null } {
  const lower = text.toLowerCase().trim();

  // Pattern matching: "log into account X", "log in to account X", "switch to account X", "switch account to X", "use account X"
  const patterns = [
    /(?:log\s*in\s*to|login\s*to|switch\s*to|switch\s*account\s*to|use\s*account)\s*(?:account\s*)?([a-zA-Z0-9_\-\s]+)/i,
    /switch\s*to\s*([a-zA-Z0-9_\-\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const label = match[1].trim();
      // Avoid false positives like "switch to workspace" or "switch to dark mode"
      if (
        !label.includes('workspace') &&
        !label.includes('chat') &&
        !label.includes('dark') &&
        !label.includes('light') &&
        !label.includes('screen')
      ) {
        // Clean up common prefixes like "account "
        const cleaned = label.replace(/^account\s+/i, '').trim();
        return { isSwitchCommand: true, targetAccountLabel: cleaned || label };
      }
    }
  }

  return { isSwitchCommand: false, targetAccountLabel: null };
}
