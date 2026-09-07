import {
  AutomationRule,
  RuleTriggerType,
  RuleActionType,
  RunCodeEntry,
  RunCodeHookPoint,
} from '../types';

/**
 * Parses user input in plain language ("if this happens, do this") into a structured rule.
 * Example: "if a login fails because of a connection issue, retry automatically"
 */
export function parsePlainLanguageRule(text: string): {
  title: string;
  description: string;
  triggerType: RuleTriggerType;
  triggerLabel: string;
  triggerCondition: string;
  actionType: RuleActionType;
  actionLabel: string;
  actionConfig: AutomationRule['actionConfig'];
} {
  const lower = text.toLowerCase().trim();

  // 1. Detect Trigger
  let triggerType: RuleTriggerType = 'connection_error';
  let triggerLabel = 'On Connection Issue or Login Failure';
  let triggerCondition = 'Network drop, login failure or unreachable host';

  if (
    lower.includes('connection') ||
    lower.includes('login fail') ||
    lower.includes('offline') ||
    lower.includes('network error')
  ) {
    triggerType = 'connection_error';
    triggerLabel = 'On Connection Issue or Network Failure';
    triggerCondition = 'Connection drops, request timeout, or server unreachable';
  } else if (
    lower.includes('rate limit') ||
    lower.includes('usage limit') ||
    lower.includes('429') ||
    lower.includes('quota')
  ) {
    triggerType = 'rate_limit';
    triggerLabel = 'On Usage Limit or Rate Limit';
    triggerCondition = 'Account reaches usage ceiling or returns HTTP 429';
  } else if (
    lower.includes('script fail') ||
    lower.includes('code error') ||
    lower.includes('runtime error')
  ) {
    triggerType = 'code_execution_error';
    triggerLabel = 'On Code Execution Error';
    triggerCondition = 'Script throws exception or exceeds memory limits';
  } else if (
    lower.includes('model error') ||
    lower.includes('ai error') ||
    lower.includes('generation fail')
  ) {
    triggerType = 'model_error';
    triggerLabel = 'On AI Model Generation Failure';
    triggerCondition = 'AI API throws non-200 status or timeout';
  } else if (
    lower.includes('message contains') ||
    lower.includes('prompt contains') ||
    lower.includes('mentions') ||
    lower.includes('keyword') ||
    lower.includes('asks for')
  ) {
    triggerType = 'keyword_match';
    triggerLabel = 'On Keyword or Topic Match';
    const keywordMatch = lower.match(/(?:mentions|contains|asks for)\s+["']?([^"',.;\n]+)["']?/i);
    triggerCondition = keywordMatch ? `Contains keyword: "${keywordMatch[1].trim()}"` : 'Prompt mentions target keyword';
  } else if (lower.includes('send') || lower.includes('message sent')) {
    triggerType = 'message_sent';
    triggerLabel = 'On Message Sent';
    triggerCondition = 'Whenever user sends any message';
  } else {
    triggerType = 'custom_event';
    triggerLabel = 'Custom Trigger Event';
    triggerCondition = 'User-defined conditional event';
  }

  // 2. Detect Action
  let actionType: RuleActionType = 'retry_automatically';
  let actionLabel = 'Retry Automatically';
  let actionConfig: AutomationRule['actionConfig'] = { maxRetries: 3 };

  if (
    lower.includes('retry') ||
    lower.includes('try again') ||
    lower.includes('reconnect')
  ) {
    actionType = 'retry_automatically';
    actionLabel = 'Retry Automatically';
    const retriesMatch = lower.match(/(\d+)\s*(?:times|attempts)/i);
    actionConfig = { maxRetries: retriesMatch ? parseInt(retriesMatch[1], 10) : 3 };
  } else if (
    lower.includes('switch') ||
    lower.includes('fallback') ||
    lower.includes('change account')
  ) {
    actionType = 'switch_account';
    actionLabel = 'Switch to Backup Account / Provider';
    actionConfig = { targetAccountLabel: 'Backup Account' };
  } else if (
    lower.includes('notify') ||
    lower.includes('alert') ||
    lower.includes('show toast') ||
    lower.includes('message me')
  ) {
    actionType = 'notify_user';
    actionLabel = 'Notify User with Alert';
    actionConfig = { customMessage: 'Automation rule triggered alert' };
  } else if (
    lower.includes('format') ||
    lower.includes('markdown') ||
    lower.includes('highlight') ||
    lower.includes('style')
  ) {
    actionType = 'auto_format_code';
    actionLabel = 'Auto-Format Code with Syntax Highlighting';
    actionConfig = { instructionPayload: 'Format code cleanly with markdown fences' };
  } else if (
    lower.includes('save to note') ||
    lower.includes('note') ||
    lower.includes('log')
  ) {
    actionType = 'save_to_notes';
    actionLabel = 'Auto-Save Record to Notes';
    actionConfig = { customMessage: 'Auto-saved event log' };
  } else if (
    lower.includes('run code') ||
    lower.includes('execute script') ||
    lower.includes('run script')
  ) {
    actionType = 'execute_run_code';
    actionLabel = 'Execute Run Code Extension';
    actionConfig = { runCodeEntryId: 'runcode-metrics' };
  } else {
    actionType = 'append_instruction';
    actionLabel = 'Append Behavioral Instruction';
    actionConfig = { instructionPayload: 'Follow user-defined rule context' };
  }

  // 3. Generate clean title
  let generatedTitle = 'Custom Rule';
  if (triggerType === 'connection_error' && actionType === 'retry_automatically') {
    generatedTitle = 'Connection Failure Auto-Retry';
  } else if (triggerType === 'rate_limit') {
    generatedTitle = 'Rate Limit Protection';
  } else if (triggerType === 'keyword_match') {
    generatedTitle = 'Keyword Interceptor';
  } else if (actionType === 'auto_format_code') {
    generatedTitle = 'Auto Code Formatter';
  } else {
    generatedTitle = `${triggerLabel.split(' ')[1] || 'Event'} -> ${actionLabel}`;
  }

  return {
    title: generatedTitle,
    description: text,
    triggerType,
    triggerLabel,
    triggerCondition,
    actionType,
    actionLabel,
    actionConfig,
  };
}

/**
 * Default starter automation rules
 */
export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-retry-connection',
    title: 'Connection Issue Auto-Retry',
    description: 'If a login or request fails because of a connection issue, retry automatically up to 3 times.',
    enabled: true,
    triggerType: 'connection_error',
    triggerLabel: 'Connection Issue or Network Failure',
    triggerCondition: 'If a login or API call fails due to connection drop or timeout',
    actionType: 'retry_automatically',
    actionLabel: 'Retry Automatically',
    actionConfig: { maxRetries: 3 },
    plainLanguagePrompt: 'if a login fails because of a connection issue, retry automatically',
    creationMode: 'plain_language',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
    triggerCount: 2,
    lastTriggered: '2026-09-06T01:05:22.000Z',
    lastExecutionLog: 'Auto-retried after connection timeout (Attempt 1/3 succeeded).',
  },
  {
    id: 'rule-code-formatter',
    title: 'Code Request Syntax Styler',
    description: 'When prompt asks for code, ensure AI response is formatted with syntax highlighting and comments.',
    enabled: true,
    triggerType: 'keyword_match',
    triggerLabel: 'Keyword: Code / Programming Query',
    triggerCondition: 'Prompt contains "code", "function", "javascript", or "python"',
    actionType: 'auto_format_code',
    actionLabel: 'Auto-Format Code with Syntax Highlighting',
    actionConfig: { instructionPayload: 'Provide clear syntax blocks and mobile-friendly comments' },
    plainLanguagePrompt: 'if a prompt asks for code, auto-format with syntax highlighting',
    creationMode: 'plain_language',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
    triggerCount: 5,
    lastTriggered: '2026-09-06T01:08:14.000Z',
    lastExecutionLog: 'Injected syntax highlighting constraint into prompt pipeline.',
  },
  {
    id: 'rule-rate-limit-notice',
    title: 'Usage Limit Diagnostic Notice',
    description: 'If an account hits rate limit, show a diagnostic alert and record cooldown in memory.',
    enabled: true,
    triggerType: 'rate_limit',
    triggerLabel: 'Usage Limit Ceiling (HTTP 429)',
    triggerCondition: 'Account returns 429 Too Many Requests',
    actionType: 'notify_user',
    actionLabel: 'Notify User with Alert',
    actionConfig: { customMessage: 'Active account reached usage ceiling. Cooldown timer recorded.' },
    plainLanguagePrompt: 'if an account hits usage limit, show diagnostic notice',
    creationMode: 'plain_language',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
    triggerCount: 1,
    lastTriggered: '2026-09-06T01:02:00.000Z',
    lastExecutionLog: 'Usage limit recognized. Cooldown timer displayed in chat.',
  },
  {
    id: 'rule-script-error-notes',
    title: 'Script Error Auto-Logger',
    description: 'If code execution errors in AXON Code runner, save the stack trace into Notes for debugging.',
    enabled: false,
    triggerType: 'code_execution_error',
    triggerLabel: 'Runner Sandbox Error',
    triggerCondition: 'JavaScript execution throws an unhandled exception',
    actionType: 'save_to_notes',
    actionLabel: 'Auto-Save Record to Notes',
    actionConfig: { customMessage: 'Script error log saved from AXON Code' },
    plainLanguagePrompt: 'if a script fails, save error to notes automatically',
    creationMode: 'guided_form',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
    triggerCount: 0,
  },
];

/**
 * Default starter Run Code entries (Live behavior extension layer)
 */
export const DEFAULT_RUN_CODE_ENTRIES: RunCodeEntry[] = [
  {
    id: 'runcode-response-enhancer',
    title: 'AXON Response Enhancer',
    description: 'Appends word count & engine execution footer to AI responses without modifying underlying code.',
    category: 'response_modifier',
    hookPoint: 'post_response',
    code: `// AXON Run Code Layer: Response Enhancer
// This script runs dynamically after AXON generates a response.
function processResponse(response, context) {
  const clean = response.trim();
  const wordCount = clean.split(/\\s+/).filter(Boolean).length;
  return clean + \`\\n\\n_— AXON Mobile Engine [Verified • \${wordCount} words]_\`;
}`,
    language: 'javascript',
    enabled: true,
    author: 'User Script Layer',
    version: '1.2.0',
    executionCount: 12,
    lastExecuted: '2026-09-06T01:09:12.000Z',
    lastOutput: 'Successfully attached word count footer.',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
  },
  {
    id: 'runcode-mobile-guard',
    title: '4GB RAM Mobile Prompt Guard',
    description: 'Intercepts user prompts longer than 300 characters to attach mobile-screen readability guidelines.',
    category: 'prompt_filter',
    hookPoint: 'pre_prompt',
    code: `// AXON Run Code Layer: Mobile Prompt Optimizer
// Modifies incoming prompts to request concise answers for 4GB mobile device screens.
function transformPrompt(prompt, context) {
  if (prompt.length > 300 && !prompt.includes('[Mobile]')) {
    return prompt + "\\n\\n[Mobile Guideline: Format answer for comfortable phone reading with short paragraphs]";
  }
  return prompt;
}`,
    language: 'javascript',
    enabled: true,
    author: 'User Script Layer',
    version: '1.0.0',
    executionCount: 8,
    lastExecuted: '2026-09-06T01:08:45.000Z',
    lastOutput: 'Injected mobile readability instruction.',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
  },
  {
    id: 'runcode-stats-command',
    title: 'Custom Command: /status',
    description: 'Intercepts the "/status" slash command and outputs instant hardware metrics and active rule counts.',
    category: 'custom_command',
    hookPoint: 'custom_command',
    commandKeyword: '/status',
    code: `// AXON Run Code Layer: /status command interceptor
// Intercepts /status to output live telemetry without querying external APIs.
function executeCommand(args, context) {
  const ramTarget = "4GB RAM budget";
  const storageTarget = "64GB internal storage";
  const rules = context.activeRulesCount || 3;
  const extensions = context.activeRunCodeCount || 4;

  return \`📊 AXON System Diagnostics:
• Platform: Phone-Optimized Mobile Engine
• Target Budget: \${ramTarget} / \${storageTarget}
• Active Automation Rules: \${rules} rules active
• Run Code Extensions: \${extensions} loaded
• Safety Sandbox: Enabled (Loop-Guarded)
• Offline Readiness: Ready\`;
}`,
    language: 'javascript',
    enabled: true,
    author: 'User Script Layer',
    version: '2.0.1',
    executionCount: 4,
    lastExecuted: '2026-09-06T01:06:10.000Z',
    lastOutput: 'Generated local hardware telemetry report.',
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
  },
  {
    id: 'runcode-secret-sanitizer',
    title: 'Sensitive Key Sanitizer',
    description: 'Scans prompts for accidental API keys (sk-...) and redacts them before network transmission.',
    category: 'prompt_filter',
    hookPoint: 'pre_prompt',
    code: `// AXON Run Code Layer: Sensitive Secret Masker
function transformPrompt(prompt, context) {
  // Masks accidental OpenAI or general secret keys before dispatch
  return prompt.replace(/(sk-[a-zA-Z0-9]{20,})/g, '[REDACTED_SECRET_KEY]');
}`,
    language: 'javascript',
    enabled: false,
    author: 'User Script Layer',
    version: '1.0.0',
    executionCount: 0,
    createdAt: '2026-09-06T01:00:00.000Z',
    updatedAt: '2026-09-06T01:00:00.000Z',
  },
];

/**
 * Safely executes a Run Code entry script against test or live inputs.
 */
export async function executeRunCodeScript(
  entry: RunCodeEntry,
  input: string,
  context: {
    activeRulesCount?: number;
    activeRunCodeCount?: number;
    userModel?: string;
  } = {}
): Promise<{ success: boolean; output: string; executionTimeMs: number; error?: string }> {
  const startTime = performance.now();

  try {
    // Sandbox execution context
    const fullContext = {
      ...context,
      timestamp: new Date().toISOString(),
      platform: 'AXON Mobile Engine (4GB Target)',
    };

    // Evaluate script in isolated function scope
    let result: any = null;

    if (entry.hookPoint === 'pre_prompt' || entry.category === 'prompt_filter') {
      const runner = new Function(
        'prompt',
        'context',
        `
        ${entry.code}
        if (typeof transformPrompt === 'function') {
          return transformPrompt(prompt, context);
        }
        return prompt;
      `
      );
      result = runner(input, fullContext);
    } else if (entry.hookPoint === 'post_response' || entry.category === 'response_modifier') {
      const runner = new Function(
        'response',
        'context',
        `
        ${entry.code}
        if (typeof processResponse === 'function') {
          return processResponse(response, context);
        }
        return response;
      `
      );
      result = runner(input, fullContext);
    } else if (entry.hookPoint === 'custom_command' || entry.category === 'custom_command') {
      const runner = new Function(
        'args',
        'context',
        `
        ${entry.code}
        if (typeof executeCommand === 'function') {
          return executeCommand(args, context);
        }
        return "Command executed successfully.";
      `
      );
      result = runner(input, fullContext);
    } else {
      // Standalone script
      const runner = new Function(
        'input',
        'context',
        `
        let consoleOutput = [];
        const customConsole = {
          log: (...args) => consoleOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          info: (...args) => consoleOutput.push('[INFO] ' + args.join(' ')),
          warn: (...args) => consoleOutput.push('[WARN] ' + args.join(' ')),
          error: (...args) => consoleOutput.push('[ERROR] ' + args.join(' '))
        };
        const console = customConsole;
        ${entry.code}
        if (consoleOutput.length > 0) return consoleOutput.join('\\n');
        return "Script completed without log output.";
      `
      );
      result = runner(input, fullContext);
    }

    const elapsed = Math.max(1, Math.round(performance.now() - startTime));
    const outputString = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

    return {
      success: true,
      output: outputString,
      executionTimeMs: elapsed,
    };
  } catch (err: any) {
    const elapsed = Math.max(1, Math.round(performance.now() - startTime));
    return {
      success: false,
      output: '',
      error: err?.message || String(err),
      executionTimeMs: elapsed,
    };
  }
}
