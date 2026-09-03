import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftRight, Copy, Check, Trash2, ClipboardPaste, Share2, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import type { BrainrotLevel, TranslationDirection, SubcultureType, TranslationResult, SlangTerm } from '../../types';
import { translateText } from '../../lib/translatorEngine';
import { requestAITranslation } from '../../lib/aiTranslator';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useVibeStore } from '../../store/useVibeStore';
import { Button } from '../ui/Button';

interface DualPaneWorkspaceProps {
  inputText: string;
  onInputChange: (text: string) => void;
  intensity: BrainrotLevel;
  subculture: SubcultureType;
  direction: TranslationDirection;
  onDirectionChange: (dir: TranslationDirection) => void;
  onTermClick?: (term: SlangTerm) => void;
  onOpenWhyItsFunny?: (result: TranslationResult) => void;
  onShareCard?: (result: TranslationResult) => void;
  onTranslate?: (result: TranslationResult) => void;
}

const SAMPLE_PROMPTS = [
  "We need to optimize our strategy and deliver the project on schedule.",
  "I am completely exhausted and cannot handle more tasks today.",
  "The competitor launched a better feature and we lost our market share.",
  "Please keep our discussion confidential until the announcement.",
  "Bro crashed out and lost 500 aura after getting cooked in the group chat."
];

export const DualPaneWorkspace: React.FC<DualPaneWorkspaceProps> = ({
  inputText,
  onInputChange,
  intensity,
  subculture,
  direction,
  onDirectionChange,
  onTermClick,
  onOpenWhyItsFunny,
  onShareCard,
  onTranslate
}) => {
  const { approvedSlangTerms } = useVibeStore();
  const [lastResult, setLastResult] = useState<TranslationResult>(() => 
    translateText(inputText, intensity, direction, subculture)
  );
  const [isAILoading, setIsAILoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { displayedText, isTyping } = useTypewriter(lastResult.translatedText, { speed: 14 });
  const activeRequestId = useRef(0);

  const handleTranslate = useCallback(async (textToTranslate = inputText, dir = direction) => {
    if (!textToTranslate.trim()) return;
    const reqId = ++activeRequestId.current;
    
    // 1. Instant dictionary result for 0ms UI responsiveness
    const instantRes = translateText(textToTranslate, intensity, dir, subculture);
    setLastResult(instantRes);
    if (onTranslate) onTranslate(instantRes);

    // 2. Fetch Real AI translation in background
    setIsAILoading(true);
    try {
      const aiRes = await requestAITranslation({
        text: textToTranslate,
        intensity,
        subculture,
        direction: dir,
        communitySlang: approvedSlangTerms
      });
      if (reqId === activeRequestId.current) {
        setLastResult(aiRes);
        if (onTranslate) onTranslate(aiRes);
      }
    } finally {
      if (reqId === activeRequestId.current) {
        setIsAILoading(false);
      }
    }
  }, [inputText, intensity, direction, subculture, approvedSlangTerms, onTranslate]);

  // Re-translate when parameters change
  useEffect(() => {
    if (!inputText.trim()) return;
    const timer = setTimeout(() => {
      handleTranslate(inputText, direction);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputText, direction, handleTranslate]);



  const handleSwapDirection = () => {
    const newDir = direction === 'to_genz' ? 'to_corporate' : 'to_genz';
    onDirectionChange(newDir);
    onInputChange(lastResult.translatedText);
    const res = translateText(lastResult.translatedText, intensity, newDir, subculture);
    setLastResult(res);
    if (onTranslate) onTranslate(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(lastResult.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onInputChange(text);
      handleTranslate(text, direction);
    } catch {
      // clipboard access denied
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* INPUT PANE */}
      <div className="fluid-surface flex min-h-[360px] flex-col p-5 transition-transform duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="border-2 border-black bg-[#E2F952] px-2 py-0.5 font-mono text-xs font-black text-black shadow-brutal-sm select-none">
              INPUT
            </span>
            <span className="font-display text-sm font-black text-black">
              {direction === 'to_genz' ? 'CORPORATE / STANDARD ENGLISH' : 'GEN Z / BRAINROT SLANG'}
            </span>
          </div>
          <Button
            variant="white"
            size="sm"
            onClick={handleSwapDirection}
            title="Swap translation direction"
            leftIcon={<ArrowLeftRight className="h-4 w-4" />}
          >
            SWAP
          </Button>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => {
            onInputChange(e.target.value);
            handleTranslate(e.target.value, direction);
          }}
          placeholder={direction === 'to_genz' ? 'Type standard or corporate English...' : 'Paste Gen Z brainrot slang to de-cringe...'}
          className="mt-4 min-h-[160px] w-full resize-none border-2 border-black p-3 font-mono text-sm leading-relaxed text-black placeholder:text-neutral-400 focus:bg-[#FFFDE8] focus:outline-none"
        />
        
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-black pt-3">
          <div className="flex items-center gap-2">
            <Button variant="white" size="sm" onClick={handlePaste} leftIcon={<ClipboardPaste className="h-3.5 w-3.5" />}>
              PASTE
            </Button>
            <Button 
              variant="white" 
              size="sm" 
              onClick={() => { 
                onInputChange('');
                setLastResult(prev => ({
                  ...prev,
                  originalText: '',
                  translatedText: '',
                  detectedTerms: []
                }));
                if (onTranslate) {
                  onTranslate(translateText('', intensity, direction, subculture));
                }
              }} 
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              CLEAR
            </Button>
          </div>
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                onInputChange(e.target.value);
                handleTranslate(e.target.value, direction);
              }
            }}
            className="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold shadow-brutal-sm focus:outline-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>✨ SAMPLES</option>
            {SAMPLE_PROMPTS.map((p, i) => (
              <option key={i} value={p}>{p.slice(0, 32)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* OUTPUT PANE */}
      <div className="fluid-surface flex min-h-[360px] flex-col p-5 transition-transform duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="border-2 border-black bg-[#C084FC] px-2 py-0.5 font-mono text-xs font-black text-black shadow-brutal-sm select-none">
              OUTPUT
            </span>
            <span className="font-display text-sm font-black text-black">
              {direction === 'to_genz' ? 'GEN Z / BRAINROT TRANSLATION' : 'CORPORATE DE-CRINGED ENGLISH'}
            </span>
            {isAILoading ? (
              <span className="flex items-center gap-1 border border-black bg-[#E2F952] px-1.5 py-0.5 font-mono text-[9px] font-bold text-black animate-pulse">
                <Loader2 className="h-2.5 w-2.5 animate-spin" /> AI THINKING...
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 border border-black bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-neutral-600">
                <Sparkles className="h-2.5 w-2.5 text-amber-500" /> AI READY
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onOpenWhyItsFunny && lastResult.translatedText && (
              <Button variant="cyan" size="sm" onClick={() => onOpenWhyItsFunny(lastResult)} leftIcon={<HelpCircle className="h-3.5 w-3.5" />}>
                WHY?
              </Button>
            )}
            {onShareCard && lastResult.translatedText && (
              <Button variant="coral" size="sm" onClick={() => onShareCard(lastResult)} leftIcon={<Share2 className="h-3.5 w-3.5" />}>
                CARD
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4 min-h-[160px] border-2 border-black bg-[var(--lilac)]/45 p-4 font-mono text-sm leading-relaxed text-[var(--ink)] rounded-lg">
          <p className="whitespace-pre-wrap">{displayedText}</p>
          {isTyping && <span className="inline-block h-4 w-2 animate-ping bg-black ml-1" />}
        </div>

        {/* DETECTED SLANG PILLS */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t-2 border-black pt-3">
          <span className="font-mono text-xs font-black uppercase text-neutral-600 mr-1 select-none">DETECTED:</span>
          {lastResult.detectedTerms.length === 0 ? (
            <span className="font-mono text-xs text-neutral-400 select-none">None detected</span>
          ) : (
            lastResult.detectedTerms.map((term) => (
              <button
                key={term.id}
                type="button"
                onClick={() => onTermClick && onTermClick(term)}
                className="border border-black bg-[#E2F952] px-2 py-0.5 font-mono text-xs font-black text-black shadow-brutal-sm hover:bg-[#d5ee3e] cursor-pointer"
              >
                #{term.term}
              </button>
            ))
          )}
          
          <div className="ml-auto">
            <Button
              variant={copied ? 'emerald' : 'yellow'}
              size="sm"
              onClick={handleCopy}
              disabled={!lastResult.translatedText}
              leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
