import { Bot, Ear, MessageCircle, Loader2 } from 'lucide-react';
import tutorAvatarImg from '@/assets/tutor-avatar.png';

interface TutorAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

export const TutorAvatar = ({ isListening, isSpeaking, isProcessing }: TutorAvatarProps) => {
  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="w-6 h-6 animate-spin text-white" />;
    if (isSpeaking) return <MessageCircle className="w-6 h-6 text-white" />;
    if (isListening) return <Ear className="w-6 h-6 text-white" />;
    return null;
  };

  const getStatusText = () => {
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return "Speaking";
    if (isListening) return "Listening";
    return "Ready to chat!";
  };

  const getAvatarContainerClasses = () => {
    let baseClasses = "relative w-32 h-32 rounded-full mx-auto transition-all duration-300";
    
    if (isProcessing) {
      return `${baseClasses} animate-pulse`;
    }
    if (isSpeaking) {
      return `${baseClasses} animate-pulse-speaking`;
    }
    if (isListening) {
      return `${baseClasses} animate-bounce-gentle`;
    }
    return baseClasses;
  };

  const getOverlayClasses = () => {
    let baseClasses = "absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300";
    
    if (isProcessing) {
      return `${baseClasses} bg-accent/80`;
    }
    if (isSpeaking) {
      return `${baseClasses} bg-tutor-speaking/80`;
    }
    if (isListening) {
      return `${baseClasses} bg-tutor-listening/80`;
    }
    return `${baseClasses} bg-transparent`;
  };

  return (
    <div className="text-center">
      <div className={getAvatarContainerClasses()}>
        <img 
          src={tutorAvatarImg} 
          alt="AI Tutor" 
          className="w-full h-full object-cover rounded-full"
        />
        {(isProcessing || isSpeaking || isListening) && (
          <div className={getOverlayClasses()}>
            {getStatusIcon()}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-lg font-semibold">{getStatusText()}</p>
        
        {/* Visual feedback bars for speaking */}
        {isSpeaking && (
          <div className="flex justify-center mt-3 space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-tutor-speaking rounded-full animate-wave"
                style={{
                  height: '20px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Listening indicator */}
        {isListening && (
          <div className="mt-3">
            <div className="w-16 h-1 bg-tutor-listening rounded-full mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground mt-2">
              Speak clearly and I'll hear you! 👂
            </p>
          </div>
        )}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Let me think about that... 🤔
            </p>
          </div>
        )}
        
        {/* Ready state */}
        {!isListening && !isSpeaking && !isProcessing && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Click the microphone to start talking! 🎤
            </p>
          </div>
        )}
      </div>
    </div>
  );
};