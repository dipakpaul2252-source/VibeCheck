import { useEffect } from 'react';

interface ShortcutActions {
  onTranslate?: () => void;
  onClear?: () => void;
  onToggleSound?: () => void;
  onToggleLeaderboard?: () => void;
  onOpenOCR?: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      
      // Cmd/Ctrl + Enter -> Translate
      if (isCmdOrCtrl && e.key === 'Enter' && actions.onTranslate) {
        e.preventDefault();
        actions.onTranslate();
      }
      
      // Cmd/Ctrl + K -> Clear
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k' && actions.onClear) {
        e.preventDefault();
        actions.onClear();
      }
      
      // 'M' key (outside of textarea/input) -> Toggle Mute
      if (
        e.key.toLowerCase() === 'm' &&
        actions.onToggleSound &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        actions.onToggleSound();
      }
      
      // 'L' key (outside of textarea/input) -> Toggle Leaderboard
      if (
        e.key.toLowerCase() === 'l' &&
        actions.onToggleLeaderboard &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        actions.onToggleLeaderboard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
export default useKeyboardShortcuts;
