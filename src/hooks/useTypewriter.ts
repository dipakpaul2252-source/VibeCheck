import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  speed?: number; // ms per char
  onComplete?: () => void;
}

export function useTypewriter(targetText: string, options: UseTypewriterOptions = {}) {
  const { speed = 18, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const targetTextRef = useRef(targetText);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    targetTextRef.current = targetText;
  }, [targetText]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!targetText) {
      const timer = setTimeout(() => {
        setDisplayedText('');
        setIsTyping(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    
    const startTimer = setTimeout(() => {
      setDisplayedText('');
      setIsTyping(true);
    }, 0);
    let index = 0;
    
    const interval = setInterval(() => {
      index++;
      if (index <= targetText.length) {
        setDisplayedText(targetText.slice(0, index));
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);
    
    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [targetText, speed]);

  const skipToEnd = () => {
    setDisplayedText(targetTextRef.current);
    setIsTyping(false);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  };

  return { displayedText, isTyping, skipToEnd };
}
