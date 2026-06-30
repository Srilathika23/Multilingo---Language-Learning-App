import React, { useState, useEffect, useRef } from 'react';
import MicrophoneIcon from './icons/MicrophoneIcon';
import { LanguageOption } from '../types';

// Type definitions for the Web Speech API to ensure type safety
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}


interface SpeechToTextButtonProps {
  onTranscript: (transcript: string) => void;
  language: LanguageOption;
  isDisabled: boolean;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ onTranscript, language, isDisabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    // Stop any existing recognition instance before creating a new one
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language.bcp47;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      // More user-friendly error messages
      let errorMessage = `Error: ${event.error}`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech was detected. Please try again.';
      } else if (event.error === 'network') {
          errorMessage = 'A network error occurred. Please check your connection.';
      }
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup: stop recognition if component unmounts while listening
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };

  }, [language, onTranscript]);

  const handleToggleListening = () => {
    if (isDisabled || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        // Clear previous errors before starting
        setError(null);
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
        setError("Could not start recognition. It might be already active.");
      }
    }
  };

  const buttonTitle = error
    ? `Speech Error: ${error}`
    : isListening
    ? `Listening in ${language.name}... Click to stop.`
    : `Speak a word in ${language.name}`;
    
  let buttonClass = 'text-slate-500 hover:text-cyan-400';
  if (isListening) {
    buttonClass = 'text-cyan-400 animate-pulse';
  }
  if (error) {
    buttonClass = 'text-red-500';
  }

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      disabled={isDisabled || !!error && !isListening}
      className={`p-2 rounded-full transition-colors duration-200 disabled:cursor-not-allowed ${buttonClass}`}
      title={buttonTitle}
    >
      <MicrophoneIcon className="h-6 w-6" />
    </button>
  );
};

export default SpeechToTextButton;