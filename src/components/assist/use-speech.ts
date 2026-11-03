"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useClientValue } from "@/hooks/use-media-query";

/** Minimal Web Speech API surface (not in every TS DOM lib yet). */
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: RecognitionEvent) => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

/**
 * Voice input via the Web Speech API (Chrome, Edge, Safari). `supported` is
 * false elsewhere, and the mic button hides itself.
 */
export function useSpeech(lang: string, onFinal: (text: string) => void) {
  const supported = useClientValue(() => !!getRecognition(), false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recogniser = useRef<Recognition | null>(null);
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  });

  useEffect(() => {
    const Ctor = getRecognition();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onstart = () => setListening(true);
    r.onend = r.onerror = () => {
      setListening(false);
      setInterim("");
    };
    r.onresult = (e) => {
      let heard = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript;
        else heard += res[0].transcript;
      }
      setInterim(heard);
      if (final) {
        setInterim("");
        onFinalRef.current(final.trim());
      }
    };
    recogniser.current = r;
    return () => {
      r.onend = r.onerror = r.onresult = r.onstart = null;
      r.stop();
    };
  }, [lang]);

  const toggle = useCallback(() => {
    const r = recogniser.current;
    if (!r) return;
    if (listening) r.stop();
    else r.start();
  }, [listening]);

  const stop = useCallback(() => recogniser.current?.stop(), []);

  return { supported, listening, interim, toggle, stop };
}
