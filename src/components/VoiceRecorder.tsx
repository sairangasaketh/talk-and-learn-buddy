import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  onTranscriptReceived: (transcript: string) => void;
  onListeningChange: (listening: boolean) => void;
}

export const VoiceRecorder = ({ 
  isListening, 
  isProcessing, 
  transcript,
  onTranscriptReceived,
  onListeningChange 
}: VoiceRecorderProps) => {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      onListeningChange(true);
      toast({
        title: "Listening Started",
        description: "Speak clearly and I'll understand you!"
      });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscriptReceived(finalTranscript.trim());
        stopListening();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onListeningChange(false);
      
      if (event.error === 'no-speech') {
        toast({
          title: "No Speech Detected",
          description: "I didn't hear anything. Try speaking louder!",
          variant: "destructive"
        });
      } else if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      onListeningChange(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscriptReceived, onListeningChange, toast]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds to prevent hanging
      timeoutRef.current = setTimeout(() => {
        stopListening();
        toast({
          title: "Listening Timeout",
          description: "I stopped listening. Click the mic to speak again!"
        });
      }, 10000);
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Microphone Error",
        description: "Couldn't access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [isSupported, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onListeningChange(false);
  }, [onListeningChange]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <Card className="p-6 text-center">
        <div className="text-destructive mb-4">
          <MicOff className="w-16 h-16 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Speech Recognition Not Available</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please use Chrome, Edge, or Safari for voice features.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Voice Button */}
      <div className="text-center">
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          size="lg"
          className={`w-24 h-24 rounded-full text-white transition-all duration-300 ${
            isListening 
              ? 'bg-tutor-listening animate-pulse hover:bg-tutor-listening/80' 
              : 'bg-gradient-primary hover:scale-105'
          }`}
        >
          {isListening ? (
            <Square className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
        
        <p className="mt-3 text-sm font-medium">
          {isListening ? 'Click to stop' : 'Click to speak'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm font-medium text-primary mb-2">You said:</p>
          <p className="text-lg">{transcript}</p>
        </Card>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>🎤 Speak clearly and naturally</p>
        <p>⏰ I'll listen for up to 10 seconds</p>
        <p>🔄 Click again to speak more</p>
      </div>
    </div>
  );
};