export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompts: ConversationPrompt[];
}

export interface ConversationPrompt {
  id: string;
  type: 'introduction' | 'question' | 'feedback' | 'encouragement';
  text: string;
  expectedResponses?: string[];
  followUp?: string;
}

export interface TutorResponse {
  text: string;
  type: 'question' | 'feedback' | 'encouragement' | 'correction';
  audioUrl?: string;
}

export interface ConversationState {
  scenario?: Scenario;
  currentPromptIndex: number;
  conversationHistory: Array<{
    speaker: 'user' | 'tutor';
    text: string;
    timestamp: Date;
  }>;
  score: number;
  corrections: string[];
}