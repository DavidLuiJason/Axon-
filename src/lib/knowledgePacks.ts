import { KnowledgePack, KnowledgePackLesson } from '../types';

/**
 * Pre-installed Base Coding Knowledge Pack
 * Ships permanently with AXON Code. Strictly cannot be deleted by the user.
 * Modularly architected so future downloadable packs can plug in seamlessly.
 */
export const BASE_CODING_KNOWLEDGE_PACK: KnowledgePack = {
  id: 'base-coding-pack',
  title: 'AXON Foundations of Code',
  version: '1.0.0',
  isBasePack: true, // Permanent, non-deletable base system pack
  description:
    'Core programming concepts, fundamental logic, variables, loops, UI interactions, and phone command patterns.',
  icon: 'Sparkles',
  lessons: [
    {
      id: 'lesson-variables',
      title: 'Storing Information (Variables)',
      category: 'Data & State',
      description: 'Learn how computers remember numbers, text, and user inputs using variables.',
      shorthandCode: `set userName = "Alex"
set score = 100
show "Player: " + userName + " | Score: " + score`,
      realCode: `const userName = "Alex";
let score = 100;
console.log(\`Player: \${userName} | Score: \${score}\`);`,
      language: 'javascript',
      explanation:
        'A variable is like a labeled container in the phone memory. You give it a name (like userName) and store a value in it. Whenever you reference that name later, the computer recalls what was stored inside.',
      practicalTip:
        'Use descriptive names for your variables (e.g. userAge instead of just a) so your code is easy to read.',
    },
    {
      id: 'lesson-conditions',
      title: 'Making Decisions (If / Else Logic)',
      category: 'Logic & Decisions',
      description: 'Teach your software to choose different paths based on conditions.',
      shorthandCode: `set battery = 15
if battery < 20:
  show "Warning: Low battery mode activated"
else:
  show "Battery level healthy"`,
      realCode: `const battery = 15;
if (battery < 20) {
  console.log("Warning: Low battery mode activated");
} else {
  console.log("Battery level healthy");
}`,
      language: 'javascript',
      explanation:
        'Conditionals allow your program to make choices. The computer checks if a statement is true or false. If it is true, it executes one block of code; if false, it can run the "else" block.',
      practicalTip:
        'In JavaScript, use triple equals (===) to test equality so both value and type are matched cleanly.',
    },
    {
      id: 'lesson-loops',
      title: 'Repeating Tasks (Loops)',
      category: 'Iteration',
      description: 'Automate repetitive actions effortlessly without writing lines over and over.',
      shorthandCode: `repeat 5 times:
  show "Synchronizing workspace..."
show "All 5 sync pulses completed!"`,
      realCode: `for (let i = 1; i <= 5; i++) {
  console.log(\`Synchronizing workspace (pulse \${i})...\`);
}
console.log("All 5 sync pulses completed!");`,
      language: 'javascript',
      explanation:
        'Computers excel at repeating actions millions of times without fatigue. A "for" loop tells the processor: start at 1, keep going until 5, and do something on every step.',
      practicalTip:
        'Always ensure your loop has an ending condition so your phone does not get stuck in an endless loop.',
    },
    {
      id: 'lesson-ui-events',
      title: 'Interactive Buttons & User Taps',
      category: 'Mobile UI & Events',
      description: 'Connect user touches on the screen to real software actions.',
      shorthandCode: `button "Change Color" -> change color to emerald and show "Tapped!"`,
      realCode: `<button id="my-btn">Change Color</button>
<script>
  const btn = document.getElementById("my-btn");
  btn.addEventListener("click", () => {
    btn.style.backgroundColor = "#10b981";
    console.log("Button tapped and color updated!");
  });
</script>`,
      language: 'html',
      explanation:
        'User interfaces listen for "events" like clicks or taps. An Event Listener acts like an antenna waiting for touch input, then instantly executes your designated instructions.',
      practicalTip:
        'Keep button tap feedback instantaneous so the user knows their touch was registered.',
    },
    {
      id: 'lesson-functions',
      title: 'Reusable Recipes (Functions)',
      category: 'Structure',
      description: 'Group code instructions into named recipes you can call anytime.',
      shorthandCode: `recipe calculateTotal(price, tax):
  return price + (price * tax)
show "Total with tax: $" + calculateTotal(20, 0.08)`,
      realCode: `function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}
const finalAmount = calculateTotal(20, 0.08);
console.log("Total with tax: $" + finalAmount.toFixed(2));`,
      language: 'javascript',
      explanation:
        'A function is a reusable bundle of instructions. You give it inputs (parameters), it does the calculations, and it hands you back the final result (return).',
      practicalTip:
        'A function should do one specific job well. If a function is doing 5 different things, break it into smaller pieces.',
    },
    {
      id: 'lesson-lists',
      title: 'Collections & Arrays (Lists)',
      category: 'Data Structures',
      description: 'Store multiple items together in an ordered checklist or catalog.',
      shorthandCode: `list tasks = ["Review AXON architecture", "Test code runner", "Export backup"]
for each task in tasks:
  show "To-Do: " + task`,
      realCode: `const tasks = [
  "Review AXON architecture",
  "Test code runner",
  "Export backup"
];
tasks.forEach((task, index) => {
  console.log(\`[\${index + 1}] To-Do: \${task}\`);
});`,
      language: 'javascript',
      explanation:
        'An array lets you store lists of items under a single variable name. You can add items, remove items, or cycle through every item using loops or forEach.',
      practicalTip:
        'Computers index lists starting at position 0. So tasks[0] is the very first item.',
    },
    {
      id: 'lesson-commandline',
      title: 'Terminal Commands & Package Management',
      category: 'System & Commands',
      description: 'Understand what command-line tools do behind the scenes.',
      shorthandCode: `install python
show "Python runtime environment verified"`,
      realCode: `# On modern development environments:
sudo apt update && sudo apt install -y python3 python3-pip
python3 --version`,
      language: 'shell',
      explanation:
        'Package managers like apt or npm download, verify, and configure software libraries automatically. Understanding terminal commands gives you direct power over system environments.',
      practicalTip:
        'Always read what a script or command does before executing it on any machine.',
    },
  ],
};

/**
 * Returns the base pack combined with any future downloaded packs
 */
export function getAllKnowledgePacks(installedPacks: KnowledgePack[] = []): KnowledgePack[] {
  // Ensure base pack is always first and strictly present
  const nonBasePacks = installedPacks.filter((p) => !p.isBasePack && p.id !== BASE_CODING_KNOWLEDGE_PACK.id);
  return [BASE_CODING_KNOWLEDGE_PACK, ...nonBasePacks];
}

export function findLessonById(lessonId: string): KnowledgePackLesson | undefined {
  return BASE_CODING_KNOWLEDGE_PACK.lessons.find((l) => l.id === lessonId);
}
