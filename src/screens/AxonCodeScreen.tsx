import React, { useState } from 'react';
import {
  FileCode,
  Terminal,
  Play,
  RotateCcw,
  Save,
  Check,
  FolderGit2,
  Sparkles,
  BookOpen,
  FolderOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkillLevelHeader } from '../components/code/SkillLevelHeader';
import { GuidedModeView } from '../components/code/GuidedModeView';
import { EditorConsoleView } from '../components/code/EditorConsoleView';
import { CommandTranslatorModal } from '../components/code/CommandTranslatorModal';
import { KnowledgePackView } from '../components/code/KnowledgePackView';
import { SavedScriptsModal } from '../components/code/SavedScriptsModal';
import { CodeSkillLevel, SavedScript } from '../types';

export const AxonCodeScreen: React.FC = () => {
  const { codeSkillLevel, setCodeSkillLevel, showToast } = useApp();

  // Active view inside AXON Code: 'code' or 'pack'
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'pack'>('code');
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

  // Editor state for Assisted, Developer, Expert modes
  const [editorCode, setEditorCode] = useState<string>(`// AXON Code - Phone-Optimized Lightweight Engine
// Target: 4GB RAM / 64GB storage device budget

function calculateStats() {
  const dataset = [12, 45, 68, 23, 89, 34, 76];
  const total = dataset.reduce((acc, val) => acc + val, 0);
  const average = total / dataset.length;

  return {
    itemsCount: dataset.length,
    sumTotal: total,
    averageValue: average.toFixed(2),
    sandboxStatus: "Active"
  };
}

console.log("Analyzing data in mobile sandbox:");
console.log(calculateStats());`);

  const [editorLanguage, setEditorLanguage] = useState<
    'javascript' | 'python' | 'shorthand' | 'html'
  >('javascript');

  // Modals
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Handler for loading a saved script
  const handleLoadScript = (script: SavedScript) => {
    setEditorCode(script.code);
    setEditorLanguage(script.language);
    setCodeSkillLevel(script.skillLevel);
    setActiveCodeTab('code');
    showToast(`Loaded script: "${script.title}"`);
  };

  // Handler for running translated code or lesson code
  const handleRunCodeFromExternal = (code: string, lang: string) => {
    setEditorCode(code);
    if (lang === 'html') setEditorLanguage('html');
    else if (lang === 'python') setEditorLanguage('python');
    else if (lang === 'shell') setEditorLanguage('javascript');
    else setEditorLanguage('javascript');

    // Switch to developer or assisted view to see execution
    if (codeSkillLevel === 'guided') {
      setCodeSkillLevel('assisted');
    }
    setActiveCodeTab('code');
    showToast('Code loaded into runner');
  };

  // Handler for navigating to a knowledge pack lesson
  const handleLearnMoreLesson = (lessonId?: string) => {
    setSelectedLessonId(lessonId);
    setActiveCodeTab('pack');
  };

  return (
    <div
      id="axon-code-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-3 flex flex-col select-none"
    >
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-3">
        {/* Secondary Sub-Navigation Toolbar */}
        <div className="flex items-center justify-between bg-neutral-900/90 p-2 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveCodeTab('code');
                setSelectedLessonId(undefined);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCodeTab === 'code'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Coding Studio
            </button>

            <button
              type="button"
              onClick={() => setActiveCodeTab('pack')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCodeTab === 'pack'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Base Knowledge Pack</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Command Translator Shortcut Button */}
            <button
              id="open-translator-btn"
              type="button"
              onClick={() => setIsTranslatorOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
              title="Command Translator"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Translator</span>
            </button>

            {/* Saved Scripts Shortcut Button */}
            <button
              id="open-saved-scripts-btn"
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
              title="Saved Scripts"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skill Level Mode Switcher (Guided, Assisted, Developer, Expert) */}
        {activeCodeTab === 'code' && (
          <SkillLevelHeader
            currentLevel={codeSkillLevel}
            onSelectLevel={(lvl: CodeSkillLevel) => {
              setCodeSkillLevel(lvl);
              showToast(`Switched to ${lvl.toUpperCase()} mode`);
            }}
          />
        )}

        {/* Main View Body */}
        {activeCodeTab === 'pack' ? (
          <KnowledgePackView
            initialLessonId={selectedLessonId}
            onBack={() => {
              setActiveCodeTab('code');
              setSelectedLessonId(undefined);
            }}
            onTryCode={(code, lang) => {
              handleRunCodeFromExternal(code, lang);
            }}
          />
        ) : codeSkillLevel === 'guided' ? (
          /* Guided Mode: Proactive Welcome, Shorthand Converter & Side-by-side Real Code Comparison */
          <GuidedModeView
            onOpenTranslator={() => setIsTranslatorOpen(true)}
            onOpenKnowledgePack={() => setActiveCodeTab('pack')}
          />
        ) : (
          /* Assisted, Developer, Expert Mode: Code Editor, Language Selector & Console */
          <EditorConsoleView
            skillLevel={codeSkillLevel}
            code={editorCode}
            onChangeCode={setEditorCode}
            language={editorLanguage}
            onChangeLanguage={setEditorLanguage}
            onOpenSavedModal={() => setIsSavedModalOpen(true)}
            onOpenTranslator={() => setIsTranslatorOpen(true)}
          />
        )}
      </div>

      {/* Command Translator Modal (Plain English -> Real Code with Run/Explain/Learn options) */}
      <CommandTranslatorModal
        isOpen={isTranslatorOpen}
        onClose={() => setIsTranslatorOpen(false)}
        onRunCode={(code, lang) => handleRunCodeFromExternal(code, lang)}
        onLearnMore={(lessonId) => handleLearnMoreLesson(lessonId)}
      />

      {/* Saved Scripts Modal (Delete with Confirmation) */}
      <SavedScriptsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onLoadScript={handleLoadScript}
      />
    </div>
  );
};
