import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';

interface ModeSelectorProps {
  onModeSelect: (mode: 'chatbot' | 'roleplay') => void;
}

export const ModeSelector = ({ onModeSelect }: ModeSelectorProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Choose Your Learning Mode
        </h2>
        <p className="text-lg text-muted-foreground">
          How would you like to practice English today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free-flow Chatbot Mode */}
        <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
              onClick={() => onModeSelect('chatbot')}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Free-flow AI Chatbot</h3>
            <p className="text-muted-foreground mb-6">
              Have natural conversations with your AI tutor. Ask questions, practice speaking, 
              and get instant feedback on grammar and pronunciation.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Open conversation topics</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Real-time grammar feedback</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Adaptive difficulty</span>
            </div>
          </div>

          <Button className="w-full bg-gradient-primary group-hover:shadow-lg">
            Start Chatting
          </Button>
        </Card>

        {/* Interactive Roleplay Mode */}
        <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
              onClick={() => onModeSelect('roleplay')}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Interactive Roleplay</h3>
            <p className="text-muted-foreground mb-6">
              Practice real-world scenarios like ordering food, job interviews, 
              or casual conversations with structured guidance.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Structured scenarios</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Goal-oriented practice</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Progress tracking</span>
            </div>
          </div>

          <Button className="w-full bg-gradient-primary group-hover:shadow-lg">
            Choose Scenario
          </Button>
        </Card>
      </div>
    </div>
  );
};