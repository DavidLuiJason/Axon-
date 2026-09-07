import { ProjectItem, NoteItem, ChatMessage, NoteCategory } from '../types';

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-general',
    name: 'General Workspace',
    description: 'Default personal workspace for general inquiries, quick notes, and daily tasks.',
    systemContext: 'Keep responses focused, efficient, and versatile across general topics.',
    color: '#ffffff',
    icon: 'folder',
    isDefault: true,
    createdAt: '2026-09-01',
    updatedAt: '2026-09-06',
  },
  {
    id: 'proj-axon-core',
    name: 'AXON Mobile Core',
    description: 'Design systems, UI components, split-pane mechanics, and touch interactions for mobile.',
    systemContext: 'Focus on minimal footprint, high-contrast monochrome design, 44px touch targets, and mobile constraints (4GB RAM).',
    color: '#e5e5e5',
    icon: 'smartphone',
    isDefault: false,
    createdAt: '2026-09-02',
    updatedAt: '2026-09-06',
  },
  {
    id: 'proj-automation',
    name: 'Automation & AI Lab',
    description: 'Custom run-code extensions, conditional trigger rules, and multi-model pipeline testing.',
    systemContext: 'Prioritize error-handling, rate-limit safety cooldowns, JavaScript sandbox stability, and clean telemetry.',
    color: '#d4d4d4',
    icon: 'zap',
    isDefault: false,
    createdAt: '2026-09-03',
    updatedAt: '2026-09-06',
  },
];

export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'AXON Architectural Principles',
    content: `# Architectural Principles for AXON Mobile
1. Offline-First Capability: All text, calc, color, and image tools run client-side without internet.
2. Dual-Pane Ergonomics: Instant draggable divider between conversational AI and workspace preview.
3. Isolated Project Memory: Each project maintains its own isolated message stream and notes context.
4. Delete-with-Confirmation: Mandatory confirmation dialog on any deletion to protect user data.`,
    projectId: 'proj-axon-core',
    tags: ['architecture', 'mobile', 'principles'],
    isPinned: true,
    category: 'architecture',
    createdAt: '2026-09-03',
    updatedAt: '2026-09-06',
  },
  {
    id: 'note-2',
    title: 'Run Code Sandbox Safety Rules',
    content: `# Sandbox Guidelines
- Functions execute in an isolated scope with \`input\` and \`context\` objects.
- Pre-prompt hooks clean or augment user queries prior to API dispatch.
- Post-response hooks format AI responses or append custom telemetry.
- Custom slash commands like /status intercept locally with zero latency.`,
    projectId: 'proj-automation',
    tags: ['automation', 'code', 'sandbox'],
    isPinned: true,
    category: 'code',
    createdAt: '2026-09-04',
    updatedAt: '2026-09-06',
  },
  {
    id: 'note-3',
    title: 'Touch Target & Ergonomics Checklist',
    content: `## Ergonomic Standards:
- Minimum interactive touch target: 44px × 44px
- High-contrast black & white palette for maximum readability under direct daylight
- Zero nested cards; flat border dividers
- Single-line button chips with no awkward text wrapping`,
    projectId: 'proj-axon-core',
    tags: ['design', 'ux', 'checklist'],
    isPinned: false,
    category: 'general',
    createdAt: '2026-09-05',
    updatedAt: '2026-09-06',
  },
  {
    id: 'note-4',
    title: 'Project Ideas & Daily Scratchpad',
    content: `## Ideas Backlog:
- [x] Multi-AI Provider manual switching
- [x] Automation & live Run Code layer
- [x] Per-project context isolation & Notes memory
- [ ] Timeline video editor with waveform synthesis (Future part)`,
    projectId: 'proj-general',
    tags: ['ideas', 'backlog'],
    isPinned: false,
    category: 'idea',
    createdAt: '2026-09-06',
    updatedAt: '2026-09-06',
  },
];

export const NOTE_CATEGORIES: { id: NoteCategory; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'extracted_chat', label: 'Extracted Chat' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'code', label: 'Code & Scripts' },
  { id: 'meeting', label: 'Takeaways' },
  { id: 'idea', label: 'Idea / Backlog' },
];

/**
 * Format messages into standard Markdown for export or note creation
 */
export function formatConversationAsMarkdown(
  messages: ChatMessage[],
  projectName: string,
  projectDescription?: string
): string {
  const timestamp = new Date().toLocaleString();
  let md = `# Conversation Export: ${projectName}\n`;
  md += `**Export Date:** ${timestamp} · **Total Messages:** ${messages.length}\n`;
  if (projectDescription) {
    md += `**Project Scope:** ${projectDescription}\n`;
  }
  md += `\n---\n\n`;

  messages.forEach((m) => {
    const isUser = m.sender === 'user';
    const senderBadge = isUser ? '👤 **User**' : `🤖 **AXON (${m.modelUsed || 'AI Engine'})**`;
    md += `### ${senderBadge} <small>(${m.timestamp})</small>\n\n`;
    if (m.attachment) {
      md += `*Attachment: ${m.attachment.name} (${m.attachment.size || m.attachment.type})*\n\n`;
    }
    md += `${m.text}\n\n---\n\n`;
  });

  return md;
}

/**
 * Format messages as clean plain text
 */
export function formatConversationAsPlainText(
  messages: ChatMessage[],
  projectName: string
): string {
  const timestamp = new Date().toLocaleString();
  let txt = `=================================================================\n`;
  txt += `AXON CONVERSATION TRANSCRIPT\n`;
  txt += `Project: ${projectName}\n`;
  txt += `Date: ${timestamp}\n`;
  txt += `Message Count: ${messages.length}\n`;
  txt += `=================================================================\n\n`;

  messages.forEach((m, idx) => {
    const sender = m.sender === 'user' ? 'USER' : `AXON [${m.modelUsed || 'AI'}]`;
    txt += `[${idx + 1}] ${sender} (${m.timestamp}):\n`;
    if (m.attachment) {
      txt += `(Attachment: ${m.attachment.name})\n`;
    }
    txt += `${m.text}\n\n-----------------------------------------------------------------\n\n`;
  });

  return txt;
}

/**
 * Format messages as raw JSON
 */
export function formatConversationAsJson(
  messages: ChatMessage[],
  projectName: string,
  projectId?: string
): string {
  return JSON.stringify(
    {
      exportType: 'axon_conversation_transcript',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project: {
        id: projectId,
        name: projectName,
      },
      messageCount: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
        modelUsed: m.modelUsed,
        accountUsed: m.accountUsed,
        attachment: m.attachment ? { name: m.attachment.name, type: m.attachment.type } : undefined,
      })),
    },
    null,
    2
  );
}

/**
 * Local offline synthesizer for structured executive summary note
 */
export function synthesizeExecutiveSummary(
  messages: ChatMessage[],
  projectName: string,
  projectDescription?: string
): string {
  const userMessages = messages.filter((m) => m.sender === 'user');
  const axonMessages = messages.filter((m) => m.sender === 'axon');

  let doc = `# Executive Summary: ${projectName}\n`;
  doc += `**Extracted:** ${new Date().toLocaleString()} · **Context Scope:** ${projectName}\n`;
  if (projectDescription) {
    doc += `**Project Goal:** ${projectDescription}\n`;
  }
  doc += `\n---\n\n`;

  doc += `## 🎯 Core Topics & User Queries\n`;
  if (userMessages.length > 0) {
    userMessages.slice(-5).forEach((m, i) => {
      const preview = m.text.length > 150 ? m.text.substring(0, 150) + '...' : m.text;
      doc += `- **Topic ${i + 1}:** ${preview}\n`;
    });
  } else {
    doc += `- No user queries recorded.\n`;
  }

  doc += `\n## 💡 Key Decisions & Recommendations\n`;
  if (axonMessages.length > 0) {
    // Extract key insights or takeaways
    axonMessages.slice(-4).forEach((m) => {
      const lines = m.text.split('\n').filter((l) => l.trim().length > 10);
      const highlight = lines[0] || m.text.substring(0, 120);
      doc += `- ${highlight}\n`;
    });
  } else {
    doc += `- Work in progress.\n`;
  }

  doc += `\n## 📋 Action Items & Next Steps\n`;
  doc += `- [ ] Review synthesized discussion points with project team\n`;
  doc += `- [ ] Apply relevant decisions in ${projectName}\n`;
  doc += `- [ ] Follow up on identified technical specifications\n`;

  // Code snippets extraction if present
  const allText = messages.map((m) => m.text).join('\n\n');
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const snippets: { lang: string; code: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(allText)) !== null) {
    snippets.push({ lang: match[1] || 'text', code: match[2].trim() });
  }

  if (snippets.length > 0) {
    doc += `\n## 💻 Extracted Code & Technical Artifacts\n`;
    snippets.slice(0, 3).forEach((s, idx) => {
      doc += `\n**Snippet ${idx + 1} (${s.lang}):**\n\`\`\`${s.lang}\n${s.code}\n\`\`\`\n`;
    });
  }

  doc += `\n---\n\n## 📜 Full Dialogue Record\n\n`;
  messages.forEach((m) => {
    const sender = m.sender === 'user' ? 'User' : 'AXON';
    doc += `**${sender} (${m.timestamp}):**\n${m.text}\n\n`;
  });

  return doc;
}

/**
 * Triggers a real browser file download
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
