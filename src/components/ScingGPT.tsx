'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useWakeWordDetection } from '@/hooks/useWakeWordDetection';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { conversationStore } from '@/lib/conversationStore';
import { autonomousDOMController, DOMAction } from '@/lib/autonomous-dom-controller';
import { autonomousComponentController, ComponentAction } from '@/lib/autonomous-component-controller';
import { getFirebaseFunctions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Bot, Mic, Loader2, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { processVoiceCommand } from '@/ai/flows/lari-scing-bridge';
import ScingIcon from '../../public/Scing_ButtonIcon_White.svg';
import { CANON } from '@/core/canon/terminology';

interface ScingGPTAutonomousProps {
  userId: string;
  accessKey: string;
}

export const ScingGPT: React.FC<ScingGPTAutonomousProps> = ({ 
  userId, 
  accessKey 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationActive, setConversationActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<'listening' | 'processing' | 'executing' | 'idle'>('idle');

  const {
    isListening: isWakeWordListening,
    startListening: startWakeWordListening,
    stopListening: stopWakeWordListening
  } = useWakeWordDetection({
    accessKey,
    wakeWords: ['hey scing', 'hey scingular'], 
    onWakeWordDetected: (index) => handleWakeWordDetected(index)
  });

  const {
    isListening: isSpeechListening,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening
  } = useSpeechRecognition({
    onResult: (transcript, isFinal) => handleSpeechResult(transcript, isFinal),
    onError: (error) => console.error('Speech error:', error)
  });

  const { speak } = useTextToSpeech();

  async function handleWakeWordDetected(wakeWordIndex: number) {
    console.log(`🎯 Scing ${CANON.BFI} Mode Activated!`);
    setIsActive(true);
    setConversationActive(true);
    setCurrentMode('processing');

    if (!sessionId) {
      try {
        const newSessionId = await conversationStore.createSession(userId, {
            wakeWordDetected: true,
            autonomousMode: true
        });
        setSessionId(newSessionId);
      } catch (e) {
          console.error("Failed to create conversation session", e);
      }
    }

    const welcomeMessage = "Scing operational. How can I assist your inspection today?";
    speak(welcomeMessage);

    setTimeout(() => {
      setCurrentMode('listening');
      startSpeechListening();
    }, 1500);
  }

  async function handleSpeechResult(transcript: string, isFinal: boolean): Promise<void> {
    if (!isFinal || !transcript.trim()) return;

    setCurrentMode('processing');
    console.log('👤 User command:', transcript);
    
    if (sessionId) {
        try {
            await conversationStore.addMessage(sessionId, userId, 'user', transcript);
        } catch (e) {
            console.error("Failed to add user message", e);
        }
    }

    try {
      // Invoke the actual BFI flow
      const response = await processVoiceCommand({
          command: transcript,
          context: `Current URL: ${window.location.pathname}`
      });
      
      console.log('🤖 Scing Response:', response);

      if (sessionId) {
          await conversationStore.addMessage(sessionId, 'system', 'assistant', response.speech);
      }
      
      speak(response.speech);

      // Execute autonomous DOM actions if provided by Scing
      if (response.domActions && response.domActions.length > 0) {
          setCurrentMode('executing');
          autonomousDOMController.queueActions(response.domActions as any);
      }
      
      setCurrentMode('listening');
      
      // Auto-resume listening after response
      setTimeout(() => {
        if (conversationActive && !isSpeechListening) {
          startSpeechListening();
        }
      }, 5000);

    } catch (error) {
      console.error('Error processing BFI command:', error);
      speak("I encountered an issue while processing that command. Check my neural link.");
      setCurrentMode('listening');
    }
  }

  const toggleAutonomous = useCallback(async () => {
    try {
      if (!isActive) {
        await startWakeWordListening();
        setIsActive(true);
        toast.success(`🤖 Scing ${CANON.BFI} Ready. Say "Hey Scing".`);
      } else {
        await stopWakeWordListening();
        stopSpeechListening();
        setIsActive(false);
        setConversationActive(false);
        setCurrentMode('idle');
        toast.success(`Scing ${CANON.BFI} Deactivated.`);
      }
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`);
    }
  }, [isActive, startWakeWordListening, stopWakeWordListening, stopSpeechListening]);

  return (
    <div className="relative flex items-center gap-2">
      <AnimatePresence>
          {isActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
              >
                  <Radio className={cn("h-3 w-3 text-primary", currentMode === 'listening' && "animate-pulse")} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Scing Active</span>
              </motion.div>
          )}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAutonomous}
        className={cn(
          "rounded-full h-9 w-9 transition-all border border-transparent p-0",
          isActive && "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]",
        )}
      >
        {currentMode === 'processing' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="h-6 w-6">
             <ScingIcon className={cn("w-full h-full text-foreground fill-current", isActive && "animate-pulse text-primary")} />
          </div>
        )}
      </Button>
    </div>
  );
};
