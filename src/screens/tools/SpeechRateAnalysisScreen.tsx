import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Activity,
  FileText,
  Clock,
  Gauge,
  Sparkles,
  BookmarkPlus,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SpeechRateAnalysisScreen: React.FC = () => {
  const { showToast, addNote } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [copied, setCopied] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordedTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordedTime((prev) => prev + 1);
      }, 1000);

      showToast('Listening... Speak naturally');
    } catch (err) {
      showToast('Microphone access unavailable. You can enter duration & transcript manually.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setAudioDuration(recordedTime);
      showToast(`Captured ${recordedTime} seconds of audio`);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Create temp audio element to calculate duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      const dur = Math.round(tempAudio.duration);
      setAudioDuration(dur);
      setRecordedTime(dur);
      showToast(`Loaded audio file: ${Math.round(dur)}s duration`);
    };
  };

  // Metrics computation
  const activeDuration = audioDuration > 0 ? audioDuration : Math.max(1, recordedTime);
  const words = transcriptText.trim() ? transcriptText.trim().split(/\s+/).length : 0;
  const chars = transcriptText.length;

  // Words per minute (WPM)
  const durationInMinutes = activeDuration / 60;
  const wpm = durationInMinutes > 0 && words > 0 ? Math.round(words / durationInMinutes) : 0;

  // Syllables estimation heuristic
  const estimateSyllables = (text: string) => {
    const clean = text.toLowerCase().replace(/[^a-z ]/g, '');
    const wordList = clean.split(/\s+/).filter(Boolean);
    let count = 0;
    wordList.forEach((w) => {
      if (w.length <= 3) {
        count += 1;
        return;
      }
      const syllables = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
        .replace(/^y/, '')
        .match(/[aeiouy]{1,2}/g);
      count += syllables ? syllables.length : 1;
    });
    return Math.max(1, count);
  };

  const syllables = transcriptText.trim() ? estimateSyllables(transcriptText) : 0;
  const syllablesPerSec =
    activeDuration > 0 && syllables > 0 ? (syllables / activeDuration).toFixed(1) : '0.0';

  // Cadence category
  const getPacingAnalysis = (rate: number) => {
    if (rate === 0) return { label: 'Awaiting Input', color: 'text-neutral-400', desc: 'Record audio or enter spoken transcript.' };
    if (rate < 110) return { label: 'Deliberate / Slow', color: 'text-sky-400', desc: 'Calm, instructional, or solemn tone. Excellent clarity for complex topics.' };
    if (rate <= 150) return { label: 'Conversational / Ideal', color: 'text-emerald-400', desc: 'Optimal natural pace for presentations, podcasts, and daily dialogue.' };
    if (rate <= 175) return { label: 'Brisk / Energetic', color: 'text-amber-400', desc: 'Fast-paced and lively. Great for quick pitches and broadcast reporting.' };
    return { label: 'Rapid / Rushed', color: 'text-red-400', desc: 'High velocity speech. May compromise listener comprehension over long durations.' };
  };

  const pacing = getPacingAnalysis(wpm);

  const handleSaveToLibrary = () => {
    if (!transcriptText && wpm === 0) {
      showToast('Record or input text before saving report');
      return;
    }
    const report = `# Audio Speech-Rate Report
- Measured Pace: ${wpm} WPM (${pacing.label})
- Audio Duration: ${activeDuration}s
- Total Spoken Words: ${words}
- Syllable Velocity: ${syllablesPerSec} syllables/sec
- Analysis: ${pacing.desc}

### Spoken Transcript:
${transcriptText || '(Audio recorded without transcript)'}
`;
    addNote({
      title: `Speech Analysis (${wpm} WPM)`,
      content: report,
      tags: ['audio', 'speech-rate', 'analysis'],
    });
    showToast('Saved speech rate report to Library');
  };

  const handleCopyReport = () => {
    const summary = `Speech-Rate Report: ${wpm} WPM (${pacing.label}) | Duration: ${activeDuration}s | Words: ${words} | Velocity: ${syllablesPerSec} syll/s`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Report copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="speech-rate-analysis-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-4 select-none"
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Primary Gauge Card */}
        <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-2xl relative overflow-hidden text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <Gauge className="w-4 h-4 text-white" />
              Speech Velocity Meter
            </span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] font-mono">
              Offline Acoustic Engine
            </span>
          </div>

          <div className="py-2">
            <div className="text-5xl font-extrabold font-mono tracking-tight text-white">
              {wpm}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mt-1">
              Words Per Minute (WPM)
            </div>
          </div>

          {/* Dynamic Pacing Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${pacing.color.replace('text-', 'bg-')}`} />
            <span className={`font-semibold ${pacing.color}`}>{pacing.label}</span>
          </div>
          <p className="text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
            {pacing.desc}
          </p>

          {/* Visual Scale Bar */}
          <div className="pt-2">
            <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden flex border border-neutral-800">
              <div className="w-[30%] bg-sky-500/60" title="Deliberate (<110)" />
              <div className="w-[35%] bg-emerald-500/80" title="Conversational (110-150)" />
              <div className="w-[20%] bg-amber-500/80" title="Brisk (150-175)" />
              <div className="w-[15%] bg-red-500/80" title="Rapid (>175)" />
            </div>
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1 px-1">
              <span>0</span>
              <span>110</span>
              <span>150</span>
              <span>175</span>
              <span>220+</span>
            </div>
          </div>
        </div>

        {/* Audio Recording & Input Controls */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Audio Source & Timing
            </h3>
            <span className="font-mono text-xs text-neutral-300">
              {Math.floor(activeDuration / 60)}:
              {String(activeDuration % 60).padStart(2, '0')} elapsed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="py-2.5 px-3 rounded-xl bg-red-600 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop ({recordedTime}s)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                className="py-2.5 px-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
              >
                <Mic className="w-4 h-4" />
                <span>Record Audio</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-700 active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Audio</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
          </div>

          {/* Audio Player Preview */}
          {audioUrl && (
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onPlay={() => setIsPlayingAudio(true)}
                onPause={() => setIsPlayingAudio(false)}
                onEnded={() => setIsPlayingAudio(false)}
                className="w-full h-8"
                controls
              />
            </div>
          )}
        </div>

        {/* Spoken Transcript Input Area */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              Spoken Transcript Text
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              {words} words • {chars} chars
            </span>
          </div>

          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Paste or type the spoken words spoken during the audio clip to calculate exact velocity..."
            rows={4}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 leading-relaxed resize-none"
          />

          {/* Manual Duration Stepper */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-neutral-400 text-[11px]">Manual clip duration adjustment:</span>
            <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAudioDuration((d) => Math.max(1, d - 5))}
                className="px-1.5 py-0.5 text-neutral-400 hover:text-white"
              >
                -5s
              </button>
              <span className="font-mono text-xs font-semibold px-1">{activeDuration}s</span>
              <button
                type="button"
                onClick={() => setAudioDuration((d) => d + 5)}
                className="px-1.5 py-0.5 text-neutral-400 hover:text-white"
              >
                +5s
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3 text-center">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Syllables/s</div>
            <div className="text-base font-bold font-mono text-white mt-1">{syllablesPerSec}</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">{syllables} total</div>
          </div>

          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3 text-center">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Word Count</div>
            <div className="text-base font-bold font-mono text-white mt-1">{words}</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">tokens</div>
          </div>

          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3 text-center">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Duration</div>
            <div className="text-base font-bold font-mono text-white mt-1">{activeDuration}s</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">sample</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSaveToLibrary}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save to Library</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-800 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
