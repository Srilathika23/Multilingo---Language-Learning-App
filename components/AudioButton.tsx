import React, { useState, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import SpeakerIcon from './icons/SpeakerIcon';
import StopIcon from './icons/StopIcon';
import { stopCurrentAudio, setActiveAudio, clearActiveAudio } from '../utils/audioManager';


interface AudioButtonProps {
  text: string;
  stopPropagation?: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({ text, stopPropagation = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isCancelledRef = useRef(false);

  // Centralized cleanup function
  const stopPlayback = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore errors if stop is called on an already stopped source
      }
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    audioSourceRef.current = null;
    audioContextRef.current = null;
    setIsSpeaking(false);
    setIsLoading(false);
    clearActiveAudio(); // Notify the manager that nothing is playing
  }, []);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    // If this instance is active (loading or speaking), the user wants to stop it.
    if (isLoading || isSpeaking) {
      isCancelledRef.current = true; // Mark as cancelled to prevent race conditions
      stopPlayback();
      return;
    }

    // --- Start a new audio request ---

    // 1. Stop any other audio that might be playing from another button.
    stopCurrentAudio();

    setIsLoading(true);
    setError(null);
    isCancelledRef.current = false;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) throw new Error("Your browser does not support the Web Audio API.");
      
      const base64Audio = await generateSpeech(text);

      // If cancelled while waiting for the API, bail out.
      if (isCancelledRef.current) {
        setIsLoading(false);
        return;
      }
      
      if (!base64Audio) throw new Error("The text-to-speech service returned no audio data.");
      
      const context = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = context;

      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, context, 24000, 1);
      
      // If cancelled while decoding, bail out.
      if (isCancelledRef.current) {
        context.close();
        setIsLoading(false);
        return;
      }

      const source = context.createBufferSource();
      audioSourceRef.current = source;
      source.buffer = audioBuffer;
      source.connect(context.destination);
      
      // 2. Register this button's stop function as the globally active one.
      setActiveAudio(stopPlayback);
      
      setIsLoading(false);
      setIsSpeaking(true);
      source.start();
      
      source.onended = () => {
        // This handler is called when audio finishes naturally or is stopped via .stop()
        // It calls our central cleanup function.
        stopPlayback();
      };

    } catch (err) {
      if (isCancelledRef.current) {
        // Ignore errors that might arise from a cancelled request.
        return;
      }
      console.error('Text-to-speech failed:', err);
      const userMessage = err instanceof Error && err.message.includes('Web Audio API')
        ? err.message
        : 'Failed to play audio. Please try again.';
      setError(userMessage);
      
      // Ensure state is reset and manager is cleared on error
      setIsLoading(false);
      setIsSpeaking(false);
      clearActiveAudio();
    }
  }, [text, isLoading, isSpeaking, stopPropagation, stopPlayback]);
  
  const buttonTitle = error
    ? `Error: ${error}`
    : isSpeaking
    ? 'Click to stop audio'
    : isLoading
    ? 'Generating audio... Click to cancel.'
    : `Listen to "${text.substring(0, 30)}..."`;

  const showStopIcon = isSpeaking || isLoading;

  return (
    <button
      onClick={handleClick}
      className={`relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${error ? 'bg-red-500/20 text-red-500' : 'text-slate-400 hover:bg-slate-700 hover:text-cyan-300'}`}
      aria-label={showStopIcon ? "Stop" : "Listen to text"}
      title={buttonTitle}
    >
      {showStopIcon ? (
         <StopIcon className="w-5 h-5" />
      ) : (
        <SpeakerIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default AudioButton;