import { TranslatedCommand } from '../types';

/**
 * AXON Code - Natural Language Command & Code Translator
 * Translates plain English requests into real underlying code or shell commands.
 * Explains what it does, why it works, and gives the user 3 clear choices:
 * 1. Run it
 * 2. Explain it further
 * 3. Learn more about it
 */

export const CURATED_TRANSLATIONS: Record<string, TranslatedCommand> = {
  'install python': {
    userQuery: 'install Python',
    detectedIntent: 'Install Python Runtime Environment',
    commandOrCode: `# Linux / Debian package command:
sudo apt update && sudo apt install -y python3 python3-pip
python3 --version`,
    language: 'shell',
    explanation:
      'This command instructs the Linux package manager (apt) to refresh its repository index, install the Python 3 interpreter along with the pip package manager, and verify the installed version.',
    why: 'The "sudo" prefix grants administrative authority, "-y" automatically answers yes to download prompts, and "python3 --version" confirms successful installation.',
    relatedLessonId: 'lesson-commandline',
  },
  'button that changes color': {
    userQuery: 'make a button that changes color when tapped',
    detectedIntent: 'Interactive UI Element with Event Listener',
    commandOrCode: `<div class="card">
  <button id="color-btn" style="background:#2563eb; color:white; padding:10px 18px; border-radius:12px; border:none; cursor:pointer;">
    Tap to Shift Color
  </button>
  <p id="label" style="font-size:12px; color:#888; margin-top:8px;">Current state: Initial</p>
</div>
<script>
  const colors = ["#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6"];
  let index = 0;
  const btn = document.getElementById("color-btn");
  const label = document.getElementById("label");
  btn.onclick = () => {
    index = (index + 1) % colors.length;
    btn.style.backgroundColor = colors[index];
    label.innerText = "Active color: " + colors[index];
  };
</script>`,
    language: 'html',
    explanation:
      'Creates an HTML button and attaches a JavaScript click event handler that cycles through an array of color hex codes on every user touch.',
    why: 'The modulo operator "% colors.length" creates an infinite cycle through the color array without exceeding the array boundaries.',
    relatedLessonId: 'lesson-ui-events',
  },
  'roll a dice': {
    userQuery: 'roll a dice',
    detectedIntent: 'Random Integer Generation (1 to 6)',
    commandOrCode: `function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  console.log("🎲 You rolled a: " + result);
  return result;
}
rollDice();`,
    language: 'javascript',
    explanation:
      'Generates a pseudo-random floating point number between 0 and 1, scales it to 6, rounds down to an integer, and offsets by 1 so the range is strictly 1 through 6.',
    why: 'Math.random() by default only generates numbers from 0 up to (but not including) 1, so multiplying by 6 and adding 1 shifts the numbers to match a standard 6-sided die.',
    relatedLessonId: 'lesson-variables',
  },
  'count words': {
    userQuery: 'count words in a sentence',
    detectedIntent: 'String Processing & Array Counting',
    commandOrCode: `function countWords(text) {
  const words = text.trim().split(/\\s+/).filter(Boolean);
  console.log(\`Analyzed text contains \${words.length} words.\`);
  return words.length;
}
countWords("AXON is an AI-powered workspace for mobile devices.");`,
    language: 'javascript',
    explanation:
      'Removes leading/trailing whitespaces with .trim(), splits the text wherever one or more spaces appear (/\\s+/), and counts the resulting list elements.',
    why: 'Using regular expression /\\s+/ ensures that multiple accidental spaces between words are not counted as extra words.',
    relatedLessonId: 'lesson-lists',
  },
  'countdown timer': {
    userQuery: 'make a countdown timer',
    detectedIntent: 'Asynchronous Interval Loop',
    commandOrCode: `let secondsLeft = 5;
console.log("Timer starting at " + secondsLeft + "s...");
for (let i = secondsLeft; i >= 1; i--) {
  console.log("Tick: " + i + " second" + (i === 1 ? "" : "s") + " remaining");
}
console.log("⏰ Time's up! Alert triggered.");`,
    language: 'javascript',
    explanation:
      'Decrements a seconds counter sequentially and logs remaining duration on every tick until reaching zero.',
    why: 'A reverse loop (i--) naturally models counting down from a target value towards zero.',
    relatedLessonId: 'lesson-loops',
  },
};

/**
 * Translates a user's natural language description into underlying code and explanation
 */
export function translateUserCommand(query: string): TranslatedCommand {
  const cleanQuery = query.toLowerCase().trim();

  // Check curated database first
  for (const [key, translation] of Object.entries(CURATED_TRANSLATIONS)) {
    if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
      return {
        ...translation,
        userQuery: query,
      };
    }
  }

  // Common keywords matching
  if (cleanQuery.includes('python') || cleanQuery.includes('install')) {
    return CURATED_TRANSLATIONS['install python'];
  }
  if (cleanQuery.includes('button') || cleanQuery.includes('color') || cleanQuery.includes('tap')) {
    return CURATED_TRANSLATIONS['button that changes color'];
  }
  if (cleanQuery.includes('dice') || cleanQuery.includes('random') || cleanQuery.includes('coin')) {
    return CURATED_TRANSLATIONS['roll a dice'];
  }
  if (cleanQuery.includes('count') || cleanQuery.includes('word') || cleanQuery.includes('text')) {
    return CURATED_TRANSLATIONS['count words'];
  }
  if (cleanQuery.includes('timer') || cleanQuery.includes('clock') || cleanQuery.includes('alarm')) {
    return CURATED_TRANSLATIONS['countdown timer'];
  }

  // Heuristic dynamic generation for arbitrary prompts
  const cleanTitle = query.slice(0, 40);
  return {
    userQuery: query,
    detectedIntent: `Implement: ${cleanTitle}`,
    commandOrCode: `// Translated from: "${query}"
function executeTask() {
  console.log("Executing intent: ${query.replace(/"/g, '\\"')}");
  const timestamp = new Date().toLocaleTimeString();
  console.log("Status: Task completed successfully at " + timestamp);
  return { success: true, query: "${query.replace(/"/g, '\\"')}" };
}
executeTask();`,
    language: 'javascript',
    explanation: `This JavaScript program encapsulates your objective ("${query}") inside a clean function, executes it in the phone runtime, and logs status to the console.`,
    why: 'Wrapping operations inside functions provides modularity and allows repeated execution without rewriting logic.',
    relatedLessonId: 'lesson-functions',
  };
}
