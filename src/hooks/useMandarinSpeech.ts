import { useState, useCallback, useRef, useEffect } from 'react';

export function useMandarinSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopSpeech = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveText(null);
  }, []);

  const speak = useCallback(
    (text: string, lang: 'zh-CN' | 'de-DE' = 'zh-CN') => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setActiveText(text);
      setIsSpeaking(true);

      // Estimate duration for visual soundwave fallback (at least 1.6s, ~350ms per char)
      const estimatedMs = Math.max(1600, Math.min(4500, text.length * 380));

      let ttsStarted = false;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = lang === 'zh-CN' ? 0.88 : 0.95;

          const voices = window.speechSynthesis.getVoices();
          const matchingVoice = voices.find((v) =>
            lang === 'zh-CN'
              ? v.lang.includes('zh') || v.lang.includes('cmn')
              : v.lang.includes('de')
          );
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }

          utterance.onend = () => {
            if (timerRef.current) {
              window.clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            setIsSpeaking(false);
            setActiveText(null);
          };

          utterance.onerror = () => {
            // Keep visual wave going for the estimated duration if TTS errors
          };

          window.speechSynthesis.speak(utterance);
          ttsStarted = true;
        } catch {
          ttsStarted = false;
        }
      }

      // Always set a fallback timer so the visual waveform finishes cleanly even if browser TTS is muted or unsupported
      timerRef.current = window.setTimeout(
        () => {
          setIsSpeaking(false);
          setActiveText(null);
          timerRef.current = null;
        },
        ttsStarted ? estimatedMs + 600 : estimatedMs
      );
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stopSpeech,
    isSpeaking,
    activeText,
  };
}
