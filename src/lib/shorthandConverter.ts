/**
 * AXON Code - Simplified Shorthand Syntax Parser & Real-Code Converter
 * Designed for beginners in Guided Mode to bridge human intent with real working code.
 */

export interface ShorthandComparisonItem {
  shorthandLine: string;
  realCodeLine: string;
  explanation: string;
}

export interface ShorthandConversionResult {
  originalShorthand: string;
  realJavaScript: string;
  realPython: string;
  interactiveHtml?: string;
  hasInteractiveUI: boolean;
  comparisons: ShorthandComparisonItem[];
  encouragingComment: string;
}

export interface ShorthandPreset {
  id: string;
  title: string;
  category: string;
  shorthandCode: string;
  description: string;
  iconName: string;
}

export const BEGINNER_PRESETS: ShorthandPreset[] = [
  {
    id: 'color-button',
    title: 'Color Changing Button',
    category: 'Interactive UI',
    shorthandCode: `button "Tap for Magic" -> change color to emerald and show "Color transformed!"`,
    description: 'Creates a button that shifts colors and logs a response on every tap.',
    iconName: 'Sparkles',
  },
  {
    id: 'dice-roller',
    title: 'Dice Roller (1 to 6)',
    category: 'Games & Randomness',
    shorthandCode: `set roll = random 1 to 6
show "You rolled a: " + roll
if roll == 6: show "Jackpot! Maximum roll!" else: show "Good roll, try again!"`,
    description: 'Rolls a virtual six-sided die and tests for winning conditions.',
    iconName: 'Dice',
  },
  {
    id: 'score-counter',
    title: 'Tap Counter',
    category: 'State & Numbers',
    shorthandCode: `set count = 0
repeat 5 times:
  set count = count + 1
  show "Counter reached: " + count
show "Finished counting!"`,
    description: 'Increments a counter variable inside an automated repetition loop.',
    iconName: 'PlusCircle',
  },
  {
    id: 'coin-flipper',
    title: 'Coin Flipper',
    category: 'Decision Logic',
    shorthandCode: `set coin = random 0 to 1
if coin == 1: show "HEADS - You win!" else: show "TAILS - Try again!"`,
    description: 'Flips a virtual coin using 50/50 probability logic.',
    iconName: 'Coins',
  },
  {
    id: 'greeting-generator',
    title: 'Custom Name Welcomer',
    category: 'Strings & Text',
    shorthandCode: `set userName = "Explorer"
show "Welcome to AXON Code, " + userName + "!"
show "Your journey into programming begins now."`,
    description: 'Combines text pieces (concatenation) using a stored name variable.',
    iconName: 'Smile',
  },
];

/**
 * Converts user shorthand into real JavaScript and Python with line-by-line learning comparisons
 */
export function convertShorthandToRealCode(shorthand: string): ShorthandConversionResult {
  const lines = shorthand.split('\n');
  const jsLines: string[] = [];
  const pyLines: string[] = [];
  const comparisons: ShorthandComparisonItem[] = [];
  let hasInteractiveUI = false;
  let interactiveHtml = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      continue;
    }

    // 1. Output / Printing: show "text" or print "text"
    if (trimmed.startsWith('show ') || trimmed.startsWith('print ') || trimmed.startsWith('say ')) {
      const match = trimmed.match(/^(show|print|say)\s+(.+)$/i);
      const content = match ? match[2] : '""';
      const js = `console.log(${content});`;
      const py = `print(${content})`;
      jsLines.push(js);
      pyLines.push(py);
      comparisons.push({
        shorthandLine: trimmed,
        realCodeLine: js,
        explanation: 'In JavaScript, console.log(...) outputs text to your execution screen.',
      });
      continue;
    }

    // 2. Interactive Button: button "Title" -> action
    if (trimmed.toLowerCase().includes('button ') && trimmed.includes('->')) {
      hasInteractiveUI = true;
      const btnMatch = trimmed.match(/button\s+["']([^"']+)["']\s*->\s*(.+)/i);
      const btnLabel = btnMatch ? btnMatch[1] : 'Click Me';
      const actionText = btnMatch ? btnMatch[2] : 'show "Clicked!"';

      // Parse color changing action if specified
      let colorClass = '#10b981';
      if (actionText.includes('emerald') || actionText.includes('green')) colorClass = '#10b981';
      else if (actionText.includes('blue') || actionText.includes('cyan')) colorClass = '#3b82f6';
      else if (actionText.includes('violet') || actionText.includes('purple')) colorClass = '#a855f7';
      else if (actionText.includes('amber') || actionText.includes('yellow')) colorClass = '#f59e0b';
      else if (actionText.includes('red')) colorClass = '#ef4444';

      interactiveHtml = `<div class="card">
  <span class="badge">Interactive Preview</span>
  <h3 style="font-size: 16px; margin-bottom: 12px;">AXON Dynamic Element</h3>
  <button id="demo-btn" onclick="handleTap()">${btnLabel}</button>
  <p id="status-text" style="font-size: 12px; color: #888; margin-top: 10px;">Tap button to test</p>
</div>
<script>
  let tapped = 0;
  function handleTap() {
    tapped++;
    const btn = document.getElementById('demo-btn');
    const status = document.getElementById('status-text');
    btn.style.backgroundColor = '${colorClass}';
    btn.style.borderColor = '#ffffff';
    btn.innerText = 'Active (Taps: ' + tapped + ')';
    status.innerText = 'Action executed successfully!';
    status.style.color = '#10b981';
  }
</script>`;

      const js = `// Created interactive button with event listener:\nconst btn = document.createElement("button");\nbtn.innerText = "${btnLabel}";\nbtn.onclick = () => console.log("${actionText.replace(/"/g, '\\"')}");`;
      const py = `# Python GUI equivalent using Tkinter / Webview:\nbutton = create_button("${btnLabel}", on_click=handle_action)`;
      jsLines.push(js);
      pyLines.push(py);
      comparisons.push({
        shorthandLine: trimmed,
        realCodeLine: `btn.addEventListener("click", () => { ... })`,
        explanation: 'Real software uses event listeners to detect taps and trigger actions.',
      });
      continue;
    }

    // 3. Variables: set x = val or box x = val
    if (trimmed.startsWith('set ') || trimmed.startsWith('box ') || trimmed.startsWith('let ')) {
      const varMatch = trimmed.match(/^(set|box|let)\s+([a-zA-Z0-9_]+)\s*=\s*(.+)$/i);
      if (varMatch) {
        const varName = varMatch[2];
        let varValue = varMatch[3];

        // Random range check: random 1 to 6
        if (varValue.includes('random ')) {
          const randMatch = varValue.match(/random\s+(\d+)\s+to\s+(\d+)/i);
          if (randMatch) {
            const min = parseInt(randMatch[1], 10);
            const max = parseInt(randMatch[2], 10);
            const jsRand = `Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min}`;
            const pyRand = `random.randint(${min}, ${max})`;
            jsLines.push(`let ${varName} = ${jsRand};`);
            pyLines.push(`${varName} = ${pyRand}`);
            comparisons.push({
              shorthandLine: trimmed,
              realCodeLine: `let ${varName} = ${jsRand};`,
              explanation: `Math.random() generates numbers; Math.floor rounds down to integers.`,
            });
            continue;
          }
        }

        const js = `let ${varName} = ${varValue};`;
        const py = `${varName} = ${varValue}`;
        jsLines.push(js);
        pyLines.push(py);
        comparisons.push({
          shorthandLine: trimmed,
          realCodeLine: js,
          explanation: `The 'let' keyword reserves a memory slot called '${varName}' to store data.`,
        });
        continue;
      }
    }

    // 4. Loops: repeat N times: ... or loop N:
    if (trimmed.startsWith('repeat ') || trimmed.startsWith('loop ')) {
      const loopMatch = trimmed.match(/^(repeat|loop)\s+(\d+)\s*(times)?:\s*(.*)$/i);
      if (loopMatch) {
        const count = loopMatch[2];
        const innerAction = loopMatch[4];
        let innerJs = '';
        if (innerAction) {
          if (innerAction.startsWith('show ') || innerAction.startsWith('print ')) {
            innerJs = `  console.log(${innerAction.replace(/^(show|print)\s+/, '')});`;
          } else {
            innerJs = `  ${innerAction};`;
          }
        } else {
          innerJs = `  console.log("Iteration", i);`;
        }

        const js = `for (let i = 1; i <= ${count}; i++) {\n${innerJs}\n}`;
        const py = `for i in range(1, ${parseInt(count) + 1}):\n    ${innerAction || 'print(i)'}`;
        jsLines.push(js);
        pyLines.push(py);
        comparisons.push({
          shorthandLine: trimmed,
          realCodeLine: `for (let i = 1; i <= ${count}; i++) { ... }`,
          explanation: `'for' loops repeat code while tracking iterations with a counter variable.`,
        });
        continue;
      }
    }

    // 5. Conditions: if condition: action else: action
    if (trimmed.startsWith('if ')) {
      const condMatch = trimmed.match(/^if\s+([^:]+):\s*([^e]+)(else:\s*(.*))?$/i);
      if (condMatch) {
        const condition = condMatch[1].replace(/==/g, '===');
        const trueAction = condMatch[2].trim();
        const falseAction = condMatch[4]?.trim();

        const trueJs = trueAction.startsWith('show ')
          ? `console.log(${trueAction.replace(/^show\s+/, '')});`
          : trueAction;

        let js = `if (${condition}) {\n  ${trueJs}\n}`;
        if (falseAction) {
          const falseJs = falseAction.startsWith('show ')
            ? `console.log(${falseAction.replace(/^show\s+/, '')});`
            : falseAction;
          js += ` else {\n  ${falseJs}\n}`;
        }

        jsLines.push(js);
        pyLines.push(`# Python:\nif ${condMatch[1]}:\n    ${trueAction}`);
        comparisons.push({
          shorthandLine: trimmed,
          realCodeLine: `if (${condition}) { ... }`,
          explanation: `'if/else' checks a condition boolean (true or false) and branches execution.`,
        });
        continue;
      }
    }

    // Default fallback: direct passthrough if already valid code or basic expression
    jsLines.push(trimmed);
    pyLines.push(trimmed);
    comparisons.push({
      shorthandLine: trimmed,
      realCodeLine: trimmed,
      explanation: 'Direct instruction executed into the runtime environment.',
    });
  }

  const encouragingMessages = [
    'Great job! Look at the side-by-side comparison below to see how your shorthand maps to real JavaScript.',
    'You are coding! Notice how variables and functions work together in real syntax.',
    'Awesome experiment! Comparing your simple command with real code builds real programming intuition.',
  ];
  const encouragingComment =
    encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return {
    originalShorthand: shorthand,
    realJavaScript: jsLines.join('\n'),
    realPython: pyLines.join('\n'),
    interactiveHtml: hasInteractiveUI ? interactiveHtml : undefined,
    hasInteractiveUI,
    comparisons,
    encouragingComment,
  };
}
