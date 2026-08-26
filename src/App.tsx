import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MarqueeBanner } from './components/layout/MarqueeBanner';
import { DualPaneWorkspace } from './components/translator/DualPaneWorkspace';
import { BrainrotSlider } from './components/translator/BrainrotSlider';
import { SubculturePicker } from './components/translator/SubculturePicker';
import { TelemetryDashboard } from './components/telemetry/TelemetryDashboard';
import { VibeVerdictFeed } from './components/gamification/VibeVerdictFeed';
import { SlangDetailModal } from './components/telemetry/SlangDetailModal';
import { ShareCardModal } from './components/translator/ShareCardModal';
import { WhyItsFunnyDrawer } from './components/translator/WhyItsFunnyDrawer';
import { ScreenshotDecoder } from './components/ocr/ScreenshotDecoder';
import { LeaderboardModal } from './components/gamification/LeaderboardModal';
import { SubmitSlangModal } from './components/gamification/SubmitSlangModal';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { useVibeStore } from './store/useVibeStore';
import { soundEngine } from './lib/audioEffects';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Scan, Trophy, Plus, Trash2 } from 'lucide-react';
import type { BrainrotLevel, SubcultureType, SlangTerm, TranslationResult, TranslationDirection } from './types';

export function App() {
  const { 
    soundEnabled, 
    history, 
    toggleSound, 
    addTranslation, 
    clearHistory 
  } = useVibeStore();

  // Controlled Editor Settings
  const [inputText, setInputText] = useState('We need to optimize our strategy and deliver the project on schedule.');
  const [direction, setDirection] = useState<TranslationDirection>('to_genz');
  const [intensity, setIntensity] = useState<BrainrotLevel>(3);
  const [subculture, setSubculture] = useState<SubcultureType>('universal');
  const [cringeScore, setCringeScore] = useState<number>(24);

  // Modals & Drawers State
  const [selectedTerm, setSelectedTerm] = useState<SlangTerm | null>(null);
  const [shareCardResult, setShareCardResult] = useState<TranslationResult | null>(null);
  const [whyItsFunnyResult, setWhyItsFunnyResult] = useState<TranslationResult | null>(null);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Slang Proposal Form State
  const [showSubmitForm, setShowSubmitForm] = useState(false);


  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onToggleSound: toggleSound,
    onToggleLeaderboard: () => setIsLeaderboardOpen((prev) => !prev),
    onOpenOCR: () => setIsOCROpen(true),
    onClear: () => {
      soundEngine.playClick();
      setInputText('');
      setCringeScore(0);
      setWhyItsFunnyResult(null);
    }
  });

  const handleIntensityChange = (level: BrainrotLevel) => {
    setIntensity(level);
    soundEngine.playLevelMorph(level);
  };

  const handleSubcultureChange = (sub: SubcultureType) => {
    setSubculture(sub);
    soundEngine.playClick();
  };



  return (
    <div className="min-h-screen bg-[#F4F0EA] text-black font-display antialiased selection:bg-[#E2F952] selection:text-black pb-12">
      {/* 1. TOP NAVBAR */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenLeaderboard={() => {
          soundEngine.playClick();
          setIsLeaderboardOpen(true);
        }}
      />

      {/* 2. REAL-TIME VELOCITY MARQUEE */}
      <MarqueeBanner />

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8 sm:px-6 lg:px-8">
        
        {/* ACTION BAR: MULTIMODAL OCR + SUBCULTURE PICKER + PROPOSE WORD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-3 border-black bg-white p-4 shadow-brutal">
          <SubculturePicker
            selected={subculture}
            onSelect={handleSubcultureChange}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="cyan"
              size="sm"
              onClick={() => setIsOCROpen(true)}
              leftIcon={<Scan className="h-4 w-4" />}
            >
              SCAN SCREENSHOT
            </Button>
            <Button
              variant="lilac"
              size="sm"
              onClick={() => setIsLeaderboardOpen(true)}
              leftIcon={<Trophy className="h-4 w-4" />}
            >
              LEADERBOARD
            </Button>
            <Button
              variant="coral"
              size="sm"
              onClick={() => {
                soundEngine.playClick();
                setShowSubmitForm(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              PROPOSE SLANG
            </Button>
          </div>
        </div>

        {/* 4. DUAL-PANE TRANSLATION WORKSPACE */}
        <DualPaneWorkspace
          inputText={inputText}
          onInputChange={setInputText}
          intensity={intensity}
          subculture={subculture}
          direction={direction}
          onDirectionChange={setDirection}
          onTermClick={(term) => setSelectedTerm(term)}
          onOpenWhyItsFunny={(result) => setWhyItsFunnyResult(result)}
          onShareCard={(result) => setShareCardResult(result)}
          onTranslate={(result) => {
            setCringeScore(result.cringeScore);
            if (result.translatedText) {
              addTranslation(result);
            }
          }}
        />

        {/* 5. MECHANICAL BRAINROT INTENSITY DIAL */}
        <BrainrotSlider
          value={intensity}
          onChange={handleIntensityChange}
        />

        {/* 6. LOWER TELEMETRY, VERDICT & HISTORY GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <TelemetryDashboard
            cringeScore={cringeScore}
            activeTerm={selectedTerm}
          />
          <VibeVerdictFeed />

          {/* RECENT TRANSLATIONS HISTORY */}
          <Card variant="yellow" shadowSize="md" className="flex flex-col justify-between min-h-[300px] border-3">
            <div>
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-3 select-none">
                <h4 className="flex items-center gap-2 font-display text-xs font-black uppercase text-black">
                  🕰️ Translation History
                </h4>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-1 hover:bg-black/10 border border-black bg-white shadow-brutal-sm rounded cursor-pointer"
                    title="Clear history logs"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      soundEngine.playClick();
                      setInputText(item.originalText);
                      setDirection(item.direction);
                      setIntensity(item.intensity);
                      setCringeScore(item.cringeScore);
                    }}
                    className="border border-black bg-white p-2.5 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-[1px] transition-all cursor-pointer text-left"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="border border-black bg-neutral-100 px-1 py-0.5 font-mono text-[8px] font-bold text-black uppercase">
                        {item.direction === 'to_genz' ? 'to gen-z' : 'to corp'}
                      </span>
                      <span className="font-mono text-[8px] text-neutral-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="font-display font-bold text-xs text-black line-clamp-1">
                      {item.originalText}
                    </p>
                    <p className="font-mono text-[10px] text-neutral-500 line-clamp-1 italic">
                      "{item.translatedText}"
                    </p>
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="border border-dashed border-black/40 p-8 text-center font-mono text-xs text-neutral-500 uppercase font-bold">
                    No logged translations.
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-black/15 pt-2 text-[9px] font-mono text-neutral-400 text-center uppercase select-none">
              Earn +10 per translate // +15 per vote
            </div>
          </Card>
        </div>
      </main>

      {/* 7. FOOTER */}
      <footer className="mt-16 border-t-3 border-black bg-white px-4 py-6 text-center font-mono text-xs font-bold text-neutral-600">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-2 sm:flex-row">
          <span>VIBECHECK // REAL-TIME CULTURAL RAG TRANSLATION ENGINE &copy; 2026</span>
          <span className="border border-black bg-[#E2F952] px-2 py-0.5 text-black">
            HOTKEYS: [CMD+ENTER] TRANSLATE | [M] MUTE | [L] LEADERBOARD
          </span>
        </div>
      </footer>

      {/* --- MODALS & DRAWERS --- */}
      
      {/* 1. Slang Detail Glossary File Modal */}
      <SlangDetailModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
      />

      {/* 2. Share Vibe Card Modal */}
      <ShareCardModal
        result={shareCardResult}
        onClose={() => setShareCardResult(null)}
      />

      {/* 3. Why It's Funny Anatomy Drawer */}
      <WhyItsFunnyDrawer
        isOpen={!!whyItsFunnyResult}
        result={whyItsFunnyResult}
        onClose={() => setWhyItsFunnyResult(null)}
      />

      {/* 4. Multimodal Screenshot Scanner */}
      <ScreenshotDecoder
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onDecodeComplete={(text) => {
          setInputText(text);
        }}
      />

      {/* 5. Leaderboards Standings Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* 6. Propose Slang Submission Form Modal */}
      {showSubmitForm && (
        <SubmitSlangModal
          isOpen={showSubmitForm}
          onClose={() => setShowSubmitForm(false)}
        />
      )}
    </div>
  );
}

export default App;
