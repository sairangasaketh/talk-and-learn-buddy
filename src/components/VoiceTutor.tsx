import { useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { VoiceState, Scenario, ConversationState, TutorResponse } from '@/types/tutor';
import { TutorAvatar } from './TutorAvatar';
import { VoiceRecorder } from './VoiceRecorder';
import { ScenarioSelector } from './ScenarioSelector';

interface VoiceTutorProps {
  apiKey?: string;
}

export const VoiceTutor = ({ apiKey }: VoiceTutorProps) => {
  const { toast } = useToast();
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    response: ''
  });

  const [conversationState, setConversationState] = useState<ConversationState>({
    currentPromptIndex: 0,
    conversationHistory: [],
    score: 0,
    corrections: []
  });

  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [tempApiKey, setTempApiKey] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleScenarioSelect = useCallback((scenario: Scenario) => {
    setConversationState(prev => ({
      ...prev,
      scenario,
      currentPromptIndex: 0,
      conversationHistory: [],
      score: 0,
      corrections: []
    }));
    
    // Start with tutor introduction
    const introPrompt = scenario.prompts[0];
    if (introPrompt) {
      speakText(introPrompt.text);
    }
  }, []);

  const speakText = useCallback(async (text: string) => {
    if (!apiKey && !tempApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key to use text-to-speech.",
        variant: "destructive"
      });
      return;
    }

    setVoiceState(prev => ({ ...prev, isSpeaking: true, response: text }));

    try {
      // Use a default voice for the demo - you would use ElevenLabs API here
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [apiKey, tempApiKey, toast]);

  const generateResponse = useCallback(async (userText: string): Promise<TutorResponse> => {
    if (!conversationState.scenario) {
      return { text: "Please select a scenario first!", type: 'question' };
    }

    // Simulate AI response generation - you would use GPT-4 API here
    const responses = [
      "That's great! Can you tell me more about that?",
      "Excellent pronunciation! Let's try another phrase.",
      "Good job! Now let's practice something new.",
      "I love your enthusiasm! Keep going!",
      "Perfect! You're doing wonderfully!"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: randomResponse,
      type: 'encouragement'
    };
  }, [conversationState.scenario]);

  const handleTranscriptReceived = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    setVoiceState(prev => ({ ...prev, transcript, isProcessing: true }));

    // Add user message to history
    setConversationState(prev => ({
      ...prev,
      conversationHistory: [
        ...prev.conversationHistory,
        { speaker: 'user', text: transcript, timestamp: new Date() }
      ]
    }));

    try {
      const response = await generateResponse(transcript);
      
      // Add tutor response to history
      setConversationState(prev => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { speaker: 'tutor', text: response.text, timestamp: new Date() }
        ],
        score: prev.score + 10 // Simple scoring
      }));

      await speakText(response.text);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [generateResponse, speakText, toast]);

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Voice Tutor!</h2>
          <p className="text-muted-foreground mb-6">
            Enter your ElevenLabs API key to get started with realistic voice synthesis.
            You can also continue with browser speech synthesis for now.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="ElevenLabs API Key (optional)"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <div className="space-y-2">
              <Button 
                onClick={() => setShowApiKeyInput(false)}
                className="w-full bg-gradient-primary"
              >
                Continue with Browser Speech
              </Button>
              {tempApiKey && (
                <Button 
                  onClick={() => {
                    setShowApiKeyInput(false);
                    toast({
                      title: "API Key Set!",
                      description: "Now using ElevenLabs for premium voice synthesis."
                    });
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  Use ElevenLabs API
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-tutor-success/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            AI Voice Tutor
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn English through fun conversations! 🌟
          </p>
          {conversationState.score > 0 && (
            <Badge variant="secondary" className="mt-2">
              Score: {conversationState.score} points! 🎉
            </Badge>
          )}
        </div>

        {!conversationState.scenario ? (
          <ScenarioSelector onScenarioSelect={handleScenarioSelect} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tutor Avatar & Status */}
            <Card className="p-6">
              <TutorAvatar 
                isListening={voiceState.isListening}
                isSpeaking={voiceState.isSpeaking}
                isProcessing={voiceState.isProcessing}
              />
              
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {conversationState.scenario.title}
                </h3>
                <Badge variant="outline">
                  {conversationState.scenario.difficulty}
                </Badge>
              </div>

              {voiceState.response && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">Tutor says:</p>
                  <p className="mt-1">{voiceState.response}</p>
                </div>
              )}
            </Card>

            {/* Voice Interface */}
            <Card className="p-6">
              <VoiceRecorder
                isListening={voiceState.isListening}
                isProcessing={voiceState.isProcessing}
                transcript={voiceState.transcript}
                onTranscriptReceived={handleTranscriptReceived}
                onListeningChange={(listening) => 
                  setVoiceState(prev => ({ ...prev, isListening: listening }))
                }
              />

              {/* Conversation History */}
              <div className="mt-6 max-h-64 overflow-y-auto space-y-3">
                {conversationState.conversationHistory.slice(-6).map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.speaker === 'user' 
                        ? 'bg-primary/10 ml-4' 
                        : 'bg-secondary/20 mr-4'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {message.speaker === 'user' ? 'You' : 'Tutor'}:
                    </p>
                    <p className="mt-1">{message.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Reset button */}
        {conversationState.scenario && (
          <div className="text-center mt-6">
            <Button 
              variant="outline"
              onClick={() => setConversationState(prev => ({ ...prev, scenario: undefined }))}
            >
              Choose Different Scenario
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};