
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface AIAnalystChatProps {
  onClose: () => void;
}

const predefinedAnswers: Record<string, string> = {
  "why did engagement drop from day 14 to day 21?": `Between Day 14 and Day 21 after Mutation 2, engagement saw a decline. During this interval, we tested a variant ad where the game element was swapped with Minecraft, but the rest of the visual—especially the Cola product—remained unchanged.

🎯 Here's what likely happened:

Audience fatigue: The core creative (featuring the Cola) was already familiar. Swapping only the game without refreshing the overall context may not have been novel enough to spark interest.

Mismatch in novelty: Minecraft has a nostalgic and specific fan base, but without cohesive changes to the ad's tone or messaging, it may have created a visual incongruity, making the update feel random instead of intentional.`,
  
  "why did engagement rise so rapidly from day 21 to day 28?": `From Day 21 to Day 28, we observed a notable spike in engagement, coinciding with Mutation 3: the Cola product color was changed to a vibrant green.

🔬 Here's the breakdown:

Visual disruption drove curiosity: The unexpected color shift in a well-known product acted as a pattern interrupt. This sort of novelty triggers attention and drives user interaction.

Social virality effect: Such radical changes often lead to users sharing the ad or commenting, asking "Why is the Coke green?"—even if subconsciously. This builds hype loops.

Perceived special edition: Green product variants are often seen as limited editions or event-based tie-ins. Viewers might have speculated on exclusivity or thematic relevance (e.g. gaming collab, Earth Day), further boosting interaction.`,
  
  "is this sustainable?": `✅ Yes — by design.

The intent behind Mutation 3 (turning the Cola drink green) was to ignite short-term hype through visual disruption. This tactic succeeded by amplifying attention and interaction.

💡 What makes it sustainable:

This was a strategic burst, not a permanent shift.

At Mutation 4, scheduled for post-Day 28, the ad will revert to the original Cola design, restoring familiarity.

This oscillation between shock and stability helps keep the audience engaged without oversaturating them with gimmicks.

📊 In essence: We leveraged novelty to reinvigorate the audience, and now we anchor the campaign with a return to the classic. This rhythm is key to long-term campaign health.`
};

const AIAnalystChat: React.FC<AIAnalystChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello! I'm your Campaign AI Analyst. How can I help you understand your campaign metrics today?",
      sender: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Search for answers in predefined answers (case insensitive)
    const userQuery = inputValue.toLowerCase().trim();
    
    // Find the closest match
    const answer = Object.entries(predefinedAnswers).find(([question]) => 
      userQuery.includes(question.toLowerCase()) || 
      question.toLowerCase().includes(userQuery)
    );

    // Simulate typing delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 1,
        text: answer ? answer[1] : "I don't have specific data on that question yet. Could you try asking about engagement changes between days 14-21, 21-28, or about sustainability?",
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border-0 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 bg-transparent">
        <div className="flex flex-col h-full min-h-[450px] backdrop-blur-2xl bg-gradient-to-br from-black/95 via-indigo-950/90 to-black/95 rounded-2xl border border-indigo-500/30 shadow-[0_0_45px_rgba(124,58,237,0.3)]">
          {/* Header with animated gradient */}
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-violet-700 to-indigo-800 animate-gradient-shift opacity-90"></div>
            
            {/* Sparkle effects */}
            <div className="absolute top-1/2 left-1/4 h-2 w-2 bg-white/80 rounded-full animate-sparkle"></div>
            <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 bg-white/70 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 h-1 w-1 bg-white/60 rounded-full animate-sparkle" style={{ animationDelay: '1.4s' }}></div>
            
            {/* Header content */}
            <div className="relative z-10 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-11 w-11 border-2 border-white/20 shadow-lg shadow-indigo-500/40 animate-glow">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst&backgroundColor=gradient" alt="AI Analyst" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-violet-700">
                    <Bot className="h-6 w-6 text-indigo-100" />
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-white">Campaign AI Analyst</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-xs text-indigo-100 opacity-80">Analyzing metrics in real-time</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="rounded-full p-1.5 bg-white/10 hover:bg-white/20 transition-colors duration-300 group"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
          {/* Messages container with glass effect */}
          <div className="relative h-[350px] overflow-y-auto py-5 px-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-600/20 scrollbar-track-transparent flex-grow">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/0 via-indigo-950/5 to-indigo-950/20 pointer-events-none"></div>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-3 duration-300 delay-75`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0 border border-indigo-500/30 shadow-md shadow-indigo-500/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst&backgroundColor=gradient" alt="AI Analyst" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-violet-700">
                      <Bot className="h-4 w-4 text-indigo-200" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-900/30'
                      : 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 text-gray-100 border border-indigo-500/20 shadow-md backdrop-blur-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 flex-shrink-0 shadow-md shadow-indigo-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-500 shadow-inner shadow-white/10">
                      <span className="text-xs text-white font-medium">You</span>
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0 border border-indigo-500/30">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst&backgroundColor=gradient" alt="AI Analyst" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-violet-700">
                    <Bot className="h-4 w-4 text-indigo-200" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-r from-gray-900/70 to-gray-800/70 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 text-sm border border-indigo-500/20 shadow-lg">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area with glowing effect */}
          <div className="relative p-4 mt-auto rounded-b-2xl overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent pointer-events-none"></div>
            
            <div className="relative">
              <div className="flex bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-indigo-500/50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.2)] focus-within:shadow-[0_0_25px_rgba(124,58,237,0.4)]">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about campaign metrics..."
                  className="flex-1 bg-transparent border-0 px-4 py-3.5 text-sm text-white placeholder:text-indigo-300/40 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="group bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-violet-800 active:scale-95 flex items-center justify-center"
                >
                  <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>
              <div className="flex justify-center mt-3">
                <div className="text-xs text-indigo-300/60 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                  <span>Try asking about engagement changes or sustainability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalystChat;
