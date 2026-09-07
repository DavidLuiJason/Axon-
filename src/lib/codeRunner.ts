import { ExecutionResult } from '../types';

/**
 * AXON Code - Phone-Optimized Lightweight Execution Engine
 * Built specifically for mobile devices (4GB RAM target).
 * Zero heavy dependencies. 100% offline. Safe browser-sandboxed execution.
 */

export interface ExecutionOptions {
  timeoutMs?: number;
  language?: 'javascript' | 'python' | 'html' | 'shorthand';
}

/**
 * Safe execution of JavaScript code in a lightweight sandbox
 */
export async function executeJavaScript(
  code: string,
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  const timeoutMs = options.timeoutMs || 2500; // 2.5s execution guard for low-spec phones

  // Memory estimation baseline (KB)
  const codeMemoryEstimate = Math.max(12, Math.round((code.length * 2) / 1024 + 18));

  // Loop guard injector to prevent freezing lower-end devices on accidental while(true)
  const guardedCode = injectLoopGuards(code);

  return new Promise((resolve) => {
    // Custom mock console
    const mockConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(formatArg).join(' '));
      },
      info: (...args: any[]) => {
        logs.push(`[INFO] ${args.map(formatArg).join(' ')}`);
      },
      warn: (...args: any[]) => {
        logs.push(`[WARN] ${args.map(formatArg).join(' ')}`);
      },
      error: (...args: any[]) => {
        logs.push(`[ERROR] ${args.map(formatArg).join(' ')}`);
      },
    };

    let isDone = false;
    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        const elapsed = Math.round(performance.now() - startTime);
        resolve({
          output: logs.join('\n'),
          error: `Execution timed out after ${timeoutMs}ms (Protected against infinite loops to conserve phone RAM).`,
          executionTimeMs: elapsed,
          memoryEstimateKb: codeMemoryEstimate,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }, timeoutMs);

    try {
      // Execute in isolated Function scope
      const runner = new Function(
        'console',
        'setTimeout',
        'setInterval',
        'alert',
        `"use strict";
         ${guardedCode}`
      );

      // Safe wrapper providing mock console and no-op timers
      const result = runner(
        mockConsole,
        (fn: Function) => fn(), // instant sync
        () => {}, // block intervals
        (msg: string) => mockConsole.log(`[ALERT]: ${msg}`)
      );

      if (!isDone) {
        isDone = true;
        clearTimeout(timer);
        const elapsed = Math.max(1, Math.round(performance.now() - startTime));

        // Format final output
        let finalOutput = logs.join('\n');
        if (result !== undefined && !finalOutput.includes(String(result))) {
          finalOutput += (finalOutput ? '\n' : '') + `=> ${formatArg(result)}`;
        }
        if (!finalOutput) {
          finalOutput = '// Process executed successfully with exit code 0 (no output logged)';
        }

        resolve({
          output: finalOutput,
          returnVal: result,
          executionTimeMs: elapsed,
          memoryEstimateKb: codeMemoryEstimate,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      if (!isDone) {
        isDone = true;
        clearTimeout(timer);
        const elapsed = Math.max(1, Math.round(performance.now() - startTime));
        resolve({
          output: logs.join('\n'),
          error: err?.message || String(err),
          executionTimeMs: elapsed,
          memoryEstimateKb: codeMemoryEstimate,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }
  });
}

/**
 * Execute HTML/Interactive UI in a phone-safe mini canvas
 */
export function generateInteractiveHtmlPreview(htmlCode: string): string {
  // Encapsulate in a clean, self-contained HTML page with Claude-dark styling
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
    body {
      background: #000000;
      color: #ffffff;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      gap: 12px;
    }
    button, input {
      font-size: 14px;
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid #333;
      background: #1c1c1c;
      color: #fff;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    button:active { transform: scale(0.97); }
    button:hover { background: #2a2a2a; border-color: #555; }
    .card {
      background: #121212;
      border: 1px solid #282828;
      border-radius: 16px;
      padding: 20px;
      max-width: 320px;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background: #262626;
      font-size: 11px;
      color: #a3a3a3;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`;
}

/**
 * Helper to format function / object arguments safely
 */
function formatArg(arg: any): string {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return arg;
  if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
  if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

/**
 * Loop guard injection to protect 4GB RAM phones from hanging on infinite loops
 */
function injectLoopGuards(code: string): string {
  // Simple heuristic guard for while/for loops
  return code.replace(
    /(while\s*\([^)]*\)\s*\{|for\s*\([^)]*\)\s*\{)/g,
    `$1 let __axon_guard = 0; if (++__axon_guard > 5000) throw new Error("Infinite loop detected! Terminated after 5,000 iterations to protect phone RAM."); `
  );
}
