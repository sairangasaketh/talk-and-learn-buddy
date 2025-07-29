import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scenario } from '@/types/tutor';
import { 
  Coffee, 
  Users, 
  ShoppingCart, 
  MapPin, 
  GraduationCap,
  Plane,
  Heart,
  Briefcase 
} from 'lucide-react';

interface ScenarioSelectorProps {
  onScenarioSelect: (scenario: Scenario) => void;
}

const scenarios: Scenario[] = [
  {
    id: 'introduction',
    title: 'Introducing Yourself',
    description: 'Learn to introduce yourself, talk about your hobbies, and ask questions about others.',
    icon: 'Users',
    difficulty: 'beginner',
    prompts: [
      {
        id: '1',
        type: 'introduction',
        text: "Hi there! I'm your English tutor. Let's practice introducing ourselves! Can you tell me your name and age?",
        expectedResponses: ['name', 'age'],
        followUp: "Great! Now tell me about your favorite hobby or something you like to do for fun."
      },
      {
        id: '2',
        type: 'question',
        text: "That's wonderful! Now, can you ask me a question about myself?",
        expectedResponses: ['question'],
        followUp: "Perfect! I love helping students learn English. What's your favorite subject in school?"
      }
    ]
  },
  {
    id: 'restaurant',
    title: 'Ordering at a Restaurant',
    description: 'Practice ordering food, asking about menu items, and polite restaurant conversation.',
    icon: 'Coffee',
    difficulty: 'intermediate',
    prompts: [
      {
        id: '1',
        type: 'introduction',
        text: "Welcome to our restaurant! I'm your server today. What would you like to drink?",
        expectedResponses: ['drink order'],
        followUp: "Excellent choice! Are you ready to order your main course, or do you need a few more minutes?"
      }
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping for Clothes',
    description: 'Learn to ask about sizes, colors, prices, and try on clothes in a store.',
    icon: 'ShoppingCart',
    difficulty: 'intermediate',
    prompts: [
      {
        id: '1',
        type: 'introduction',
        text: "Hello! Welcome to our clothing store. How can I help you today?",
        expectedResponses: ['shopping request'],
        followUp: "Great! What size are you looking for, and do you have a preferred color?"
      }
    ]
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    description: 'Practice asking for and giving directions, talking about locations and transportation.',
    icon: 'MapPin',
    difficulty: 'beginner',
    prompts: [
      {
        id: '1',
        type: 'introduction',
        text: "You look a bit lost! Are you looking for something specific? I'd be happy to help you find your way.",
        expectedResponses: ['location request'],
        followUp: "I know exactly where that is! Let me give you directions."
      }
    ]
  }
];

const iconMap = {
  Users,
  Coffee,
  ShoppingCart,
  MapPin,
  GraduationCap,
  Plane,
  Heart,
  Briefcase
};

export const ScenarioSelector = ({ onScenarioSelect }: ScenarioSelectorProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-tutor-success text-white';
      case 'intermediate': return 'bg-tutor-warning text-white';
      case 'advanced': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Learning Adventure! 🚀</h2>
        <p className="text-muted-foreground">
          Pick a scenario to practice your English conversation skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          const IconComponent = iconMap[scenario.icon as keyof typeof iconMap] || Users;
          
          return (
            <Card 
              key={scenario.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
              onClick={() => onScenarioSelect(scenario)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-primary rounded-lg text-white group-hover:animate-bounce-gentle">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {scenario.title}
                  </h3>
                  <Badge 
                    className={`text-xs ${getDifficultyColor(scenario.difficulty)}`}
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {scenario.description}
              </p>
              
              <Button 
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onScenarioSelect(scenario);
                }}
              >
                Start Practicing! ✨
              </Button>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>💡 More scenarios coming soon! Each one gets progressively more challenging.</p>
      </div>
    </div>
  );
};