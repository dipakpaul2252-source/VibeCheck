import { useEffect, useRef } from 'react';

interface ShortcutActions {
  onTranslate?: () => void;
  onClear?: () => void;
  onToggleSound?: () => void;
  onToggleLeaderboard?: () => void;
  onOpenOCR?: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions) {
  const actionsRef = useRef(actions);

  useEffect(() => {
    actionsRef.current = actions;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const current = actionsRef.current;
      
      // Cmd/Ctrl + Enter -> Translate
      if (isCmdOrCtrl && e.key === 'Enter' && current.onTranslate) {
        e.preventDefault();
        current.onTranslate();
      }
      
      // Cmd/Ctrl + K -> Clear
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k' && current.onClear) {
        e.preventDefault();
        current.onClear();
      }
      
      // 'M' key (outside of textarea/input) -> Toggle Mute
      if (
        e.key.toLowerCase() === 'm' &&
        current.onToggleSound &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        current.onToggleSound();
      }
      
      // 'L' key (outside of textarea/input) -> Toggle Leaderboard
      if (
        e.key.toLowerCase() === 'l' &&
        current.onToggleLeaderboard &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        current.onToggleLeaderboard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export default useKeyboardShortcuts;
