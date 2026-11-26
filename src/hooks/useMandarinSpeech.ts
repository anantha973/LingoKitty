import { useState, useCallback, useRef, useEffect } from 'react';

export interface SpeakOptions {
  audioUrl?: string;
  slowUrl?: string;
  slow?: boolean;
}

function buildAudioCmnUrl(hanzi: string): string | null {
  const cleaned = hanzi
    .replace(/[。！？，、；：“”‘’（）()《》〈〉·…—\s]/g, '')
    .trim();
  if (!cleaned || cleaned.length > 6) return null;
  return `https://cdn.jsdelivr.net/gh/hugolpz/audio-cmn@master/64k/hsk/cmn-${encodeURIComponent(cleaned)}.mp3`;
}

export function useMandarinSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const prefetchedUrlsRef = useRef<Set<string>>(new Set());

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    requestIdRef.current += 1;
    clearTimer();

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.oncanplaythrough = null;
      } catch {
        // Ignore media reset errors
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore Web Speech errors
      }
    }

    setIsLoadingAudio(false);
    setIsSpeaking(false);
    setActiveText(null);
  }, [clearTimer]);

  const speakWithWebSpeech = useCallback(
    (text: string, slow: boolean, requestId: number) => {
      if (requestIdRef.current !== requestId) return;
      clearTimer();

      const estimatedMs = Math.max(
        1400,
        Math.min(5000, text.length * (slow ? 480 : 340))
      );
      let ttsStarted = false;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'zh-CN';
          utterance.rate = slow ? 0.68 : 0.88;

          const voices = window.speechSynthesis.getVoices();
          const matchingVoice =
            voices.find(
              (v) =>
                (v.lang === 'zh-CN' || v.lang === 'cmn-Hans-CN') &&
                /Tingting|Meijia|Sinji|Google|Natural|Premium/i.test(v.name)
            ) ||
            voices.find(
              (v) => v.lang.includes('zh') || v.lang.includes('cmn')
            );
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }

          utterance.onend = () => {
            if (requestIdRef.current !== requestId) return;
            clearTimer();
            setIsLoadingAudio(false);
            setIsSpeaking(false);
            setActiveText(null);
          };

          utterance.onerror = () => {
            if (requestIdRef.current !== requestId) return;
            setIsLoadingAudio(false);
          };

          window.speechSynthesis.speak(utterance);
          ttsStarted = true;
        } catch {
          ttsStarted = false;
        }
      }

      setIsLoadingAudio(false);
      setIsSpeaking(true);

      timerRef.current = window.setTimeout(
        () => {
          if (requestIdRef.current !== requestId) return;
          setIsSpeaking(false);
          setActiveText(null);
          timerRef.current = null;
        },
        ttsStarted ? estimatedMs + 600 : estimatedMs
      );
    },
    [clearTimer]
  );

  const playUrlChain = useCallback(
    (urls: string[], index: number, text: string, slow: boolean, requestId: number) => {
      if (requestIdRef.current !== requestId) return;
      if (index >= urls.length) {
        speakWithWebSpeech(text, slow, requestId);
        return;
      }

      const url = urls[index];
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;

      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.src = url;

      let settled = false;
      const tryNext = () => {
        if (settled || requestIdRef.current !== requestId) return;
        settled = true;
        audio.oncanplaythrough = null;
        audio.onended = null;
        audio.onerror = null;
        playUrlChain(urls, index + 1, text, slow, requestId);
      };

      const startPlayback = () => {
        if (settled || requestIdRef.current !== requestId) return;
        settled = true;
        setIsLoadingAudio(false);
        setIsSpeaking(true);

        // Apply playbackRate fallback only if playing a normal file at slow speed
        audio.playbackRate = slow && index === 0 ? 1.0 : slow ? 0.82 : 1.0;

        audio.play().catch(() => {
          if (requestIdRef.current !== requestId) return;
          playUrlChain(urls, index + 1, text, slow, requestId);
        });
      };

      audio.oncanplaythrough = startPlayback;
      audio.onerror = tryNext;
      audio.onended = () => {
        if (requestIdRef.current !== requestId) return;
        clearTimer();
        setIsLoadingAudio(false);
        setIsSpeaking(false);
        setActiveText(null);
      };

      // Timeout safeguard if a CDN stalls
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        if (!settled && requestIdRef.current === requestId) {
          tryNext();
        }
      }, 4500);

      audio.load();
    },
    [clearTimer, speakWithWebSpeech]
  );

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      stopSpeech();
      const requestId = requestIdRef.current;
      const slow = Boolean(options?.slow);

      setActiveText(text);
      setIsLoadingAudio(true);

      const candidateUrls: string[] = [];
      if (slow && options?.slowUrl) {
        candidateUrls.push(options.slowUrl);
      }
      if (options?.audioUrl) {
        candidateUrls.push(options.audioUrl);
      }
      const cdnFallback = buildAudioCmnUrl(text);
      if (cdnFallback && !candidateUrls.includes(cdnFallback)) {
        candidateUrls.push(cdnFallback);
      }

      if (candidateUrls.length === 0 || typeof Audio === 'undefined') {
        speakWithWebSpeech(text, slow, requestId);
        return;
      }

      playUrlChain(candidateUrls, 0, text, slow, requestId);
    },
    [playUrlChain, speakWithWebSpeech, stopSpeech]
  );

  const prefetchAudio = useCallback((url?: string) => {
    if (!url || typeof Audio === 'undefined') return;
    if (prefetchedUrlsRef.current.has(url)) return;
    if (prefetchedUrlsRef.current.size > 40) {
      prefetchedUrlsRef.current.clear();
    }
    prefetchedUrlsRef.current.add(url);
    try {
      const pre = new Audio();
      pre.preload = 'metadata';
      pre.crossOrigin = 'anonymous';
      pre.src = url;
    } catch {
      // Ignore prefetch errors
    }
  }, []);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
    speak,
    stopSpeech,
    prefetchAudio,
    isSpeaking,
    isLoadingAudio,
    activeText,
  };
}
