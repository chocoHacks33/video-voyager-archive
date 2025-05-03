
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { AIChat } from './AIChat';

export const AIAnalyst = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        onClick={() => setShowChat(true)}
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-lg shadow-cyan-500/50 focus:outline-none group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-30 transition-opacity rounded-full" />
        <img 
          src="/lovable-uploads/1749a1b9-23c6-48d5-9e48-69f401d7dc57.png"
          alt="AI Analyst"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 animate-pulse-slow rounded-full border-2 border-cyan-400/50 dark:border-cyan-500/30" />
      </button>

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <AIChat onClose={() => setShowChat(false)} />
      </Dialog>
    </div>
  );
};

export default AIAnalyst;
