import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  FileArchive,
  EyeOff,
  Grid,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ImageToolsScreen: React.FC = () => {
  const { showToast, requestConfirmation } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'convert' | 'compress' | 'blur' | 'collage'>('convert');

  // --- 1. FORMAT CONVERTER STATE ---
  const [convertImage, setConvertImage] = useState<string | null>(null);
  const [convertFileName, setConvertFileName] = useState('image');
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [convertQuality, setConvertQuality] = useState(0.85);
  const convertInputRef = useRef<HTMLInputElement>(null);

  // --- 2. COMPRESSOR STATE ---
  const [compressImage, setCompressImage] = useState<string | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [compressedFileSize, setCompressedFileSize] = useState<number>(0);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [qualityLevel, setQualityLevel] = useState(0.6);
  const [scalePercent, setScalePercent] = useState(80);
  const compressInputRef = useRef<HTMLInputElement>(null);

  // --- 3. BLUR TOOL STATE ---
  const [blurImage, setBlurImage] = useState<string | null>(null);
  const [blurRadius, setBlurRadius] = useState(8);
  const blurInputRef = useRef<HTMLInputElement>(null);
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- 4. COLLAGE STATE ---
  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [collageLayout, setCollageLayout] = useState<'2x1' | '1x2' | '2x2' | '3x1'>('2x2');
  const [collageGap, setCollageGap] = useState(8);
  const [collageBg, setCollageBg] = useState('#000000');
  const collageInputRef = useRef<HTMLInputElement>(null);
  const collageCanvasRef = useRef<HTMLCanvasElement>(null);

  // Helper format file size
  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  // 1. Format converter upload
  const handleConvertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setConvertFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => setConvertImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownloadConverted = () => {
    if (!convertImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
      const dataUrl = canvas.toDataURL(targetFormat, convertQuality);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${convertFileName}-converted.${ext}`;
      a.click();
      showToast(`Downloaded as ${ext.toUpperCase()}`);
    };
    img.src = convertImage;
  };

  // 2. Compressor handler
  const handleCompressUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      setCompressImage(reader.result as string);
      processCompression(reader.result as string, qualityLevel, scalePercent);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const processCompression = (src: string, quality: number, scale: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const factor = scale / 100;
      canvas.width = Math.round(img.width * factor);
      canvas.height = Math.round(img.height * factor);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      setCompressedDataUrl(dataUrl);

      // Estimate compressed bytes from dataUrl
      const head = 'data:image/jpeg;base64,';
      const b64 = dataUrl.substring(head.length);
      const bytes = Math.round((b64.length * 3) / 4);
      setCompressedFileSize(bytes);
    };
    img.src = src;
  };

  useEffect(() => {
    if (compressImage) {
      processCompression(compressImage, qualityLevel, scalePercent);
    }
  }, [qualityLevel, scalePercent]);

  const handleDownloadCompressed = () => {
    if (!compressedDataUrl) return;
    const a = document.createElement('a');
    a.href = compressedDataUrl;
    a.download = `axon-compressed.jpg`;
    a.click();
    showToast('Compressed image downloaded');
  };

  // 3. Blur Tool handlers
  const handleBlurUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBlurImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (!blurImage || !blurCanvasRef.current) return;
    const canvas = blurCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = Math.min(600, img.width);
      canvas.height = Math.round(img.height * (canvas.width / img.width));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(${blurRadius}px)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    };
    img.src = blurImage;
  }, [blurImage, blurRadius]);

  const handleDownloadBlurred = () => {
    if (!blurCanvasRef.current) return;
    const dataUrl = blurCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `axon-blurred.png`;
    a.click();
    showToast('Blurred image downloaded');
  };

  // 4. Collage handler
  const handleCollageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrls: string[] = [];
    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const r = new FileReader();
      r.onload = () => {
        newUrls.push(r.result as string);
        loaded++;
        if (loaded === files.length) {
          setCollageImages((prev) => [...prev, ...newUrls].slice(0, 6));
          showToast(`Added ${files.length} images for collage`);
        }
      };
      r.readAsDataURL(files[i]);
    }
    e.target.value = '';
  };

  const renderCollageOnCanvas = () => {
    if (!collageCanvasRef.current || collageImages.length === 0) return;
    const canvas = collageCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = collageBg;
    ctx.fillRect(0, 0, width, height);

    // Calculate slots
    let cols = 2;
    let rows = 2;
    if (collageLayout === '2x1') {
      cols = 2;
      rows = 1;
    } else if (collageLayout === '1x2') {
      cols = 1;
      rows = 2;
    } else if (collageLayout === '3x1') {
      cols = 3;
      rows = 1;
    }

    const gap = collageGap;
    const cellW = (width - gap * (cols + 1)) / cols;
    const cellH = (height - gap * (rows + 1)) / rows;

    const totalSlots = cols * rows;
    const imagesToDraw = collageImages.slice(0, totalSlots);

    imagesToDraw.forEach((src, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const x = gap + c * (cellW + gap);
      const y = gap + r * (cellH + gap);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw centered and cover
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cellW, cellH);
        ctx.clip();
        const scale = Math.max(cellW / img.width, cellH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const ox = x + (cellW - w) / 2;
        const oy = y + (cellH - h) / 2;
        ctx.drawImage(img, ox, oy, w, h);
        ctx.restore();
      };
      img.src = src;
    });
  };

  useEffect(() => {
    renderCollageOnCanvas();
  }, [collageImages, collageLayout, collageGap, collageBg]);

  const handleDownloadCollage = () => {
    if (!collageCanvasRef.current || collageImages.length === 0) return;
    const a = document.createElement('a');
    a.href = collageCanvasRef.current.toDataURL('image/png');
    a.download = `axon-collage.png`;
    a.click();
    showToast('Collage grid downloaded');
  };

  return (
    <div
      id="image-tools-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-4 select-none"
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Navigation Sub-Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800">
          {[
            { id: 'convert', label: 'Convert', icon: ImageIcon },
            { id: 'compress', label: 'Compress', icon: FileArchive },
            { id: 'blur', label: 'Blur', icon: EyeOff },
            { id: 'collage', label: 'Collage', icon: Grid },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- SUBTAB 1: FORMAT CONVERTER --- */}
        {activeSubTab === 'convert' && (
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Image Format Converter</h3>
              <p className="text-xs text-neutral-400">
                Transform between PNG, JPEG, and modern WEBP offline
              </p>
            </div>

            <input
              ref={convertInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleConvertUpload}
            />

            {!convertImage ? (
              <button
                type="button"
                onClick={() => convertInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl flex flex-col items-center justify-center bg-neutral-950/60 active:scale-[0.99] transition-all"
              >
                <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-white">Select Image to Convert</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WEBP, GIF, SVG</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center">
                  <img src={convertImage} alt="Preview" className="max-h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setConvertImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Target Format Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WEBP' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTargetFormat(f.id as any)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          targetFormat === f.id
                            ? 'bg-neutral-800 border-white text-white'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider if JPEG or WEBP */}
                {targetFormat !== 'image/png' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Quality</span>
                      <span>{Math.round(convertQuality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={convertQuality}
                      onChange={(e) => setConvertQuality(parseFloat(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownloadConverted}
                  className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- SUBTAB 2: COMPRESSOR --- */}
        {activeSubTab === 'compress' && (
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Image Compressor</h3>
              <p className="text-xs text-neutral-400">
                Optimize file size for lower memory usage and storage saving
              </p>
            </div>

            <input
              ref={compressInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCompressUpload}
            />

            {!compressImage ? (
              <button
                type="button"
                onClick={() => compressInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl flex flex-col items-center justify-center bg-neutral-950/60 active:scale-[0.99] transition-all"
              >
                <FileArchive className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-white">Choose Image to Compress</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Calculates byte savings instantly</span>
              </button>
            ) : (
              <div className="space-y-3">
                {/* Size stats comparison */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                  <div>
                    <p className="text-[10px] uppercase text-neutral-500">Original</p>
                    <p className="text-xs font-mono font-bold text-white mt-0.5">
                      {formatBytes(originalFileSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-neutral-500">Compressed</p>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {formatBytes(compressedFileSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-neutral-500">Saved</p>
                    <p className="text-xs font-mono font-bold text-white mt-0.5">
                      {originalFileSize > 0 && compressedFileSize > 0
                        ? `${Math.max(
                            0,
                            Math.round(
                              ((originalFileSize - compressedFileSize) / originalFileSize) * 100
                            )
                          )}%`
                        : '0%'}
                    </p>
                  </div>
                </div>

                {/* Quality & Scale sliders */}
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Compression Quality</span>
                      <span className="font-mono">{Math.round(qualityLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={qualityLevel}
                      onChange={(e) => setQualityLevel(parseFloat(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Dimension Scale</span>
                      <span className="font-mono">{scalePercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="10"
                      value={scalePercent}
                      onChange={(e) => setScalePercent(parseInt(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadCompressed}
                  className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed Image</span>
                </button>

                {/* MANDATORY SPECIFIED PLACEHOLDER: "leave a visible placeholder note/button for 'revert to original,' non-functional for now, that a future part will wire up" */}
                <div
                  id="compressor-revert-placeholder"
                  className="p-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-950/60 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-neutral-300">Revert to Original</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                        Coming in Later Part
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Reserved for full archive mode vs. space-saver mode revert logic.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 rounded-lg bg-neutral-800/40 text-neutral-500 text-xs font-medium cursor-not-allowed border border-neutral-700/50"
                  >
                    Revert
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- SUBTAB 3: BLUR TOOL --- */}
        {activeSubTab === 'blur' && (
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Image Blur Tool</h3>
              <p className="text-xs text-neutral-400">
                Apply gaussian-style blur effects for backgrounds or privacy
              </p>
            </div>

            <input
              ref={blurInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBlurUpload}
            />

            {!blurImage ? (
              <button
                type="button"
                onClick={() => blurInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl flex flex-col items-center justify-center bg-neutral-950/60 active:scale-[0.99] transition-all"
              >
                <EyeOff className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-white">Select Image to Blur</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Adjustable blur radius slider</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-2">
                  <canvas ref={blurCanvasRef} className="max-w-full max-h-56 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={() => setBlurImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Blur Radius</span>
                    <span className="font-mono">{blurRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="35"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                    className="w-full accent-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBlurred}
                  className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blurred Image</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- SUBTAB 4: COLLAGE GRID --- */}
        {activeSubTab === 'collage' && (
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Collage Grid Maker</h3>
              <p className="text-xs text-neutral-400">
                Combine 2 to 6 images into a unified grid canvas
              </p>
            </div>

            <input
              ref={collageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleCollageUpload}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Images loaded: {collageImages.length}
              </span>
              <button
                type="button"
                onClick={() => collageInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Add Photos</span>
              </button>
            </div>

            {collageImages.length > 0 ? (
              <div className="space-y-3">
                {/* Collage Preview Canvas */}
                <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-2 flex items-center justify-center">
                  <canvas
                    ref={collageCanvasRef}
                    className="max-w-full max-h-56 rounded-lg object-contain shadow-md"
                  />
                </div>

                {/* Layout Switcher */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase text-neutral-400 font-semibold">
                    Grid Layout
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: '2x2', label: '2 × 2' },
                      { id: '2x1', label: '2 × 1' },
                      { id: '1x2', label: '1 × 2' },
                      { id: '3x1', label: '3 × 1' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setCollageLayout(l.id as any)}
                        className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          collageLayout === l.id
                            ? 'bg-neutral-800 border-white text-white'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gap & Background Controls */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Grid Gap</span>
                      <span>{collageGap}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="24"
                      value={collageGap}
                      onChange={(e) => setCollageGap(parseInt(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 block">Canvas Border</label>
                    <div className="flex gap-2">
                      {[
                        { color: '#000000', label: 'Black' },
                        { color: '#262626', label: 'Gray' },
                        { color: '#ffffff', label: 'White' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setCollageBg(c.color)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-medium border ${
                            collageBg === c.color ? 'border-white text-white' : 'border-neutral-800 text-neutral-400'
                          }`}
                          style={{ backgroundColor: c.color === '#ffffff' ? '#ffffff' : '#171717', color: c.color === '#ffffff' ? '#000' : '#fff' }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCollageImages([])}
                    className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white border border-neutral-800"
                  >
                    Clear Images
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCollage}
                    className="flex-2 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Collage</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => collageInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl flex flex-col items-center justify-center bg-neutral-950/60 active:scale-[0.99] transition-all"
              >
                <Grid className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-white">Add 2 or More Images</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Generates clean grid layout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
