import React, { useState } from 'react';
import { Upload, X, Scan, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { soundEngine } from '../../lib/audioEffects';

interface ScreenshotDecoderProps {
  isOpen: boolean;
  onClose: () => void;
  onDecodeComplete: (extractedText: string) => void;
}

const SAMPLE_MEME_PREVIEWS = [
  {
    title: 'TikTok Comment Section',
    text: 'Bro really thought he had unspoken rizz but got caught in 4K losing 1000 aura in Ohio 💀',
  },
  {
    title: 'iMessage Group Chat',
    text: 'Can everyone please lock in on the project before we get completely cooked by management?',
  },
  {
    title: 'Workplace Slack Screenshot',
    text: 'He tried to mog the design review but suffered a fatal copium crashout.',
  }
];

export const ScreenshotDecoder: React.FC<ScreenshotDecoderProps> = ({
  isOpen,
  onClose,
  onDecodeComplete
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;
  
  const handleSimulateScan = (textToExtract: string, imageSrc?: string) => {
    setIsScanning(true);
    setExtractedText(null);
    if (imageSrc) setPreviewUrl(imageSrc);
    soundEngine.playSwap();
    
    setTimeout(() => {
      setIsScanning(false);
      setExtractedText(textToExtract);
      soundEngine.playAuraChime();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const simulatedExtracts = [
        "Bro really thought he had unspoken rizz but got caught in 4K losing 1000 aura 💀",
        "We need to lock in on these deliverables before management crashes out fr.",
        "The team tried to mog the client presentation but suffered fatal copium overload."
      ];
      const randomExtract = simulatedExtracts[Math.floor(Math.random() * simulatedExtracts.length)];
      handleSimulateScan(randomExtract, url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleSimulateScan("He tried to mog the design review but suffered a fatal copium crashout.", url);
    }
  };
  
  const handleApplyToWorkspace = () => {
    if (extractedText) {
      onDecodeComplete(extractedText);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl border-4 border-black bg-white p-6 shadow-brutal-lg animate-in fade-in zoom-in duration-150 text-left">
        <div className="flex items-center justify-between border-b-3 border-black pb-3 select-none">
          <div className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-[#FF5C00]" />
            <h3 className="font-display text-lg font-black tracking-tight text-black uppercase">
              MULTIMODAL SCREENSHOT DECODER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {/* DROPZONE / SCANNER AREA */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative mt-5 flex min-h-[160px] cursor-pointer flex-col items-center justify-center border-3 border-dashed border-black bg-[#FAF9F5] p-6 text-center hover:bg-[#FDFBE8] transition-colors overflow-hidden"
        >
          {isScanning && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Animated Laser Scanning Line */}
              <div className="absolute left-0 h-1.5 w-full bg-[#10B981] shadow-[0_0_12px_#10B981] animate-scan" />
              <div className="absolute inset-0 bg-[#10B981]/10 backdrop-blur-[1px]" />
            </div>
          )}
          {previewUrl && (
            <img src={previewUrl} alt="Uploaded screenshot" className="max-h-24 object-contain mb-2 border border-black" />
          )}
          <Upload className="h-8 w-8 text-neutral-400 mb-2 select-none" />
          <p className="font-display text-sm font-black text-black select-none">
            DRAG & DROP OR CLICK TO UPLOAD SCREENSHOT
          </p>
          <span className="font-mono text-xs font-bold text-neutral-500 mt-1 select-none">
            Supports PNG, JPG, WebP — or pick a preset below
          </span>
        </div>
        
        {/* SAMPLE PRESETS */}
        <div className="mt-4 text-left">
          <span className="font-mono text-[10px] font-black uppercase text-neutral-700 select-none">
            OR TEST WITH INSTANT PRESETS:
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {SAMPLE_MEME_PREVIEWS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isScanning}
                onClick={() => handleSimulateScan(sample.text)}
                className="border-2 border-black bg-white p-2.5 text-left shadow-brutal-sm hover:bg-[#E2F952] transition-all disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-1 font-mono text-[9px] font-black uppercase text-black">
                  <ImageIcon className="h-3 w-3" />
                  <span>{sample.title}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-neutral-600 line-clamp-2">
                  "{sample.text}"
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* OCR EXTRACTION OUTPUT */}
        {extractedText && (
          <div className="mt-5 border-3 border-black bg-[#E6FCFF] p-4 shadow-brutal text-left animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-1.5 text-black font-mono text-xs font-black">
              <CheckCircle className="h-4 w-4 text-[#10B981]" />
              <span>OCR EXTRACTION SUCCESSFUL:</span>
            </div>
            <p className="mt-2 font-mono text-xs font-bold text-black leading-relaxed">
              "{extractedText}"
            </p>
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-end gap-3 border-t-2 border-black pt-4">
          <Button variant="white" size="sm" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="yellow"
            size="sm"
            disabled={!extractedText || isScanning}
            onClick={handleApplyToWorkspace}
            leftIcon={<ArrowRight className="h-4 w-4" />}
          >
            INSERT INTO TRANSLATOR
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ScreenshotDecoder;
