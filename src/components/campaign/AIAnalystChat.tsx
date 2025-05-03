
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, MessageCircle, Sparkles } from 'lucide-react';
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
        <div className="flex flex-col h-full bg-gradient-to-br from-black/95 to-indigo-950/95 rounded-2xl border border-indigo-500/30 shadow-[0_0_35px_rgba(79,70,229,0.3)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800/80 to-violet-900/80 p-4 flex justify-between items-center rounded-t-2xl border-b border-indigo-500/20 backdrop-blur-md">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-pulse"></div>
                <Avatar className="h-10 w-10 border-2 border-indigo-400/40 shadow-inner shadow-indigo-500/50 bg-gradient-to-br from-indigo-600 to-violet-700">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst" alt="AI Analyst" className="object-cover" />
                  <AvatarFallback className="bg-indigo-700">
                    <Bot className="h-5 w-5 text-indigo-200" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-white flex items-center">
                  Campaign AI Analyst
                  <span className="ml-2 bg-indigo-600/50 text-indigo-100 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> AI
                  </span>
                </h3>
                <p className="text-xs text-indigo-200 opacity-80">Analyzing campaign metrics in real-time</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-full p-2 hover:bg-white/10 transition-colors duration-300"
            >
              <X className="h-4 w-4 text-indigo-100" />
            </button>
          </div>
          
          {/* Messages container */}
          <div className="h-[350px] overflow-y-auto py-5 px-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-600/20 scrollbar-track-transparent bg-gradient-to-b from-black/0 to-indigo-950/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-3 duration-300 delay-75`}
              >
                {message.sender === 'ai' && (
                  <div className="relative mr-2 flex-shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-violet-700 border border-indigo-400/30">
                      <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst" alt="AI Analyst" className="object-cover" />
                      <AvatarFallback className="bg-indigo-700">
                        <Bot className="h-4 w-4 text-indigo-200" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-900/30 border border-white/10'
                      : 'bg-gray-800/95 text-gray-100 border border-gray-700/50 shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
                {message.sender === 'user' && (
                  <div className="relative ml-2 flex-shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-75 blur-sm"></div>
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-700 to-violet-800 border border-indigo-400/30">
                      <AvatarFallback className="bg-indigo-600">
                        <span className="text-xs text-white font-medium">You</span>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
                <div className="relative mr-2 flex-shrink-0">
                  <div className="absolute -inset-0.5 bg-blue-500/30 rounded-full blur-sm animate-pulse"></div>
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-violet-700 border border-indigo-400/30">
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=analyst" alt="AI Analyst" className="object-cover" />
                    <AvatarFallback className="bg-indigo-700">
                      <Bot className="h-4 w-4 text-indigo-200" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-gray-800/80 text-white rounded-2xl px-4 py-2.5 text-sm border border-gray-700/50 shadow-lg backdrop-blur-sm">
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
          
          {/* Input area */}
          <div className="p-4 border-t border-indigo-800/30 mt-auto rounded-b-2xl bg-gradient-to-b from-indigo-950/50 to-black/70 backdrop-blur-md">
            <div className="flex bg-gray-900/80 border border-indigo-500/30 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all duration-300 shadow-inner">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about campaign metrics..."
                className="flex-1 bg-transparent border-0 px-4 py-3 text-sm text-white placeholder:text-indigo-300/50 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-violet-800 active:scale-95 group"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-xs text-indigo-300/60 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Try asking about engagement changes or sustainability
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalystChat;
