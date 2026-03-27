
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PorcupineWorker } from '@picovoice/porcupine-web';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';

interface WakeWordConfig {
  accessKey: string;
  wakeWords: string[];
  onWakeWordDetected: (wakeWordIndex: number) => void;
  sensitivity?: number;
}

export const useWakeWordDetection = ({
  accessKey,
  wakeWords,
  onWakeWordDetected,
  sensitivity = 0.7
}: WakeWordConfig) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const porcupineWorkerRef = useRef<PorcupineWorker | null>(null);
  const webVoiceProcessorRef = useRef<WebVoiceProcessor | null>(null);

  const initializePorcupine = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create Porcupine worker for "Hey Scing" detection
      porcupineWorkerRef.current = await PorcupineWorker.create(
        accessKey,
        wakeWords.map(word => ({
          builtin: word as any,
          sensitivity: sensitivity
        })),
        (detection: any) => {
          // In 3.x, the callback receives a PorcupineDetection object
          const index = typeof detection === 'number' ? detection : detection.index;
          console.log(`🎯 Wake word detected: ${wakeWords[index]}`);
          onWakeWordDetected(index);
        },
        { publicPath: "/porcupine_model.pv" } as any // Fixed: added required model argument
      );

      // Initialize WebVoiceProcessor with the Porcupine worker
      await WebVoiceProcessor.subscribe(porcupineWorkerRef.current);
      
      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to initialize wake word detection: ${err.message}`);
      setIsLoading(false);
    }
  }, [accessKey, wakeWords, onWakeWordDetected, sensitivity]);

  const startListening = useCallback(async () => {
    // In 4.x, subscribe already starts if the first engine is added
    // If we want to explicitly start/resume:
    try {
      // WebVoiceProcessor.resume(); // If needed, but subscribe handles it
      setIsListening(true);
      console.log('🎤 Scing is now listening for "Hey Scing"...');
    } catch (err: any) {
      setError(`Failed to start listening: ${err.message}`);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      // In 4.x, if we want to stop without unsubscribing:
      // await WebVoiceProcessor.pause();
      setIsListening(false);
      console.log('🔇 Wake word detection paused.');
    } catch (err: any) {
      setError(`Failed to stop listening: ${err.message}`);
    }
  }, []);

  const cleanup = useCallback(async () => {
    if (porcupineWorkerRef.current) {
      await WebVoiceProcessor.unsubscribe(porcupineWorkerRef.current);
      await porcupineWorkerRef.current.terminate();
      porcupineWorkerRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isListening,
    isLoading,
    error,
    startListening,
    stopListening,
    cleanup
  };
};
