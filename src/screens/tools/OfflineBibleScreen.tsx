import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BIBLE_BOOKS, queryOfflineBible, ScriptureVerse, BibleBook } from '../../lib/bibleData';

export const OfflineBibleScreen: React.FC = () => {
  const { showToast } = useApp();
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[0]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ScriptureVerse[]>([]);
  const [activeTab, setActiveTab] = useState<'read' | 'search' | 'saved'>('read');
  const [savedVerses, setSavedVerses] = useState<ScriptureVerse[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const res = queryOfflineBible(q);
    setSearchResults(res.verses);
  };

  const handleCopyVerse = (verse: ScriptureVerse) => {
    const text = `"${verse.text}" — ${verse.bookName} ${verse.chapter}:${verse.verse}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(`${verse.bookId}-${verse.chapter}-${verse.verse}`);
    showToast('Verse copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleSaveVerse = (verse: ScriptureVerse) => {
    const exists = savedVerses.some(
      (v) => v.bookId === verse.bookId && v.chapter === verse.chapter && v.verse === verse.verse
    );
    if (exists) {
      setSavedVerses((prev) =>
        prev.filter(
          (v) => !(v.bookId === verse.bookId && v.chapter === verse.chapter && v.verse === verse.verse)
        )
      );
      showToast('Verse removed from saved bookmarks');
    } else {
      setSavedVerses((prev) => [verse, ...prev]);
      showToast('Verse saved to bookmarks');
    }
  };

  const isVerseSaved = (verse: ScriptureVerse) => {
    return savedVerses.some(
      (v) => v.bookId === verse.bookId && v.chapter === verse.chapter && v.verse === verse.verse
    );
  };

  // Generate chapter verses for current book & chapter
  const currentChapterVerses: ScriptureVerse[] = queryOfflineBible(
    selectedBook.name
  ).verses.filter((v) => v.chapter === currentChapter);

  return (
    <div
      id="offline-bible-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-4 select-none"
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('read')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'read'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedVerses.length})</span>
          </button>
        </div>

        {/* TAB 1: READ MODE */}
        {activeTab === 'read' && (
          <div className="space-y-4">
            {/* Book & Chapter Selector */}
            <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3 flex items-center justify-between gap-2">
              <select
                value={selectedBook.id}
                onChange={(e) => {
                  const b = BIBLE_BOOKS.find((x) => x.id === e.target.value) || BIBLE_BOOKS[0];
                  setSelectedBook(b);
                  setCurrentChapter(1);
                }}
                className="bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold rounded-xl px-3 py-2 flex-1 focus:outline-none"
              >
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.chaptersCount} ch)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.chaptersCount} ch)
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Chapter Stepper */}
              <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  disabled={currentChapter <= 1}
                  onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
                  className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-1 font-semibold">
                  Ch. {currentChapter} / {selectedBook.chaptersCount}
                </span>
                <button
                  type="button"
                  disabled={currentChapter >= selectedBook.chaptersCount}
                  onClick={() =>
                    setCurrentChapter((c) => Math.min(selectedBook.chaptersCount, c + 1))
                  }
                  className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reading View */}
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {selectedBook.name} {currentChapter}
                  </h2>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                    {selectedBook.category} • Offline Authorized Text
                  </span>
                </div>
                {/* Font Size Toggle */}
                <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[10px]">
                  {(['sm', 'base', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-1.5 py-0.5 rounded ${
                        fontSize === sz ? 'bg-white text-black font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {sz === 'sm' ? 'A' : sz === 'base' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              {currentChapterVerses.length > 0 ? (
                <div className="space-y-3 select-text">
                  {currentChapterVerses.map((v) => {
                    const key = `${v.bookId}-${v.chapter}-${v.verse}`;
                    const saved = isVerseSaved(v);

                    return (
                      <div
                        key={key}
                        className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-800/40 transition-colors"
                      >
                        <span className="text-[11px] font-mono font-bold text-neutral-500 shrink-0 mt-0.5 w-5 text-right">
                          {v.verse}
                        </span>
                        <p
                          className={`flex-1 text-neutral-200 leading-relaxed font-serif ${
                            fontSize === 'sm'
                              ? 'text-xs'
                              : fontSize === 'lg'
                              ? 'text-base'
                              : 'text-sm'
                          }`}
                        >
                          {v.text}
                        </p>
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleSaveVerse(v)}
                            title="Save bookmark"
                            className={`p-1 rounded hover:bg-neutral-700 transition-colors ${
                              saved ? 'text-amber-400 opacity-100' : 'text-neutral-400'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyVerse(v)}
                            title="Copy verse"
                            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                          >
                            {copiedKey === key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-neutral-500 space-y-1">
                  <p>Verses for Chapter {currentChapter} are indexed locally.</p>
                  <p className="text-[11px] text-neutral-600">
                    Use search tab to query all cross-reference scriptures offline.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH MODE */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3.5 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search offline scriptures (e.g. love, light, peace, faith)..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                100% offline keyword index across canonical passages
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-2.5 select-text">
                {searchResults.map((v) => {
                  const key = `${v.bookId}-${v.chapter}-${v.verse}`;
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-mono">
                          {v.bookName} {v.chapter}:{v.verse}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleSaveVerse(v)}
                            className="p-1 text-neutral-400 hover:text-amber-400"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyVerse(v)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 font-serif leading-relaxed italic">
                        "{v.text}"
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              searchQuery && (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No matching verses found for "{searchQuery}". Try keywords like "grace", "truth", "heart".
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 3: SAVED BOOKMARKS */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedVerses.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
                <h4 className="text-xs font-semibold text-white">No Saved Scripture Verses</h4>
                <p className="text-[11px] text-neutral-500">
                  Tap the bookmark icon beside any verse in read or search mode to save it here.
                </p>
              </div>
            ) : (
              savedVerses.map((v) => (
                <div
                  key={`${v.bookId}-${v.chapter}-${v.verse}`}
                  className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      {v.bookName} {v.chapter}:{v.verse}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyVerse(v)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaveVerse(v)}
                        className="p-1 text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-200 font-serif leading-relaxed italic">
                    "{v.text}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
