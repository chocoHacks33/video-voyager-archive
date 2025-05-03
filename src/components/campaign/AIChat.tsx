
import { useState, useRef, useEffect } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Predefined answers for specific questions
const predefinedAnswers: Record<string, string> = {
  "Why did engagement drop from day 14 to day 21?": 
    "Between Day 14 and Day 21 after Mutation 2, engagement saw a decline. During this interval, we tested a variant ad where the game element was swapped with Minecraft, but the rest of the visual—especially the Cola product—remained unchanged.\n\n🎯 Here's what likely happened:\n\nAudience fatigue: The core creative (featuring the Cola) was already familiar. Swapping only the game without refreshing the overall context may not have been novel enough to spark interest.\n\nMismatch in novelty: Minecraft has a nostalgic and specific fan base, but without cohesive changes to the ad's tone or messaging, it may have created a visual incongruity, making the update feel random instead of intentional.",
  
  "Why did engagement rise so rapidly from day 21 to day 28?": 
    "From Day 21 to Day 28, we observed a notable spike in engagement, coinciding with Mutation 3: the Cola product color was changed to a vibrant green.\n\n🔬 Here's the breakdown:\n\nVisual disruption drove curiosity: The unexpected color shift in a well-known product acted as a pattern interrupt. This sort of novelty triggers attention and drives user interaction.\n\nSocial virality effect: Such radical changes often lead to users sharing the ad or commenting, asking "Why is the Coke green?"—even if subconsciously. This builds hype loops.\n\nPerceived special edition: Green product variants are often seen as limited editions or event-based tie-ins. Viewers might have speculated on exclusivity or thematic relevance (e.g. gaming collab, Earth Day), further boosting interaction.",
  
  "Is this sustainable?": 
    "✅ Yes — by design.\n\nThe intent behind Mutation 3 (turning the Cola drink green) was to ignite short-term hype through visual disruption. This tactic succeeded by amplifying attention and interaction.\n\n💡 What makes it sustainable:\n\nThis was a strategic burst, not a permanent shift.\n\nAt Mutation 4, scheduled for post-Day 28, the ad will revert to the original Cola design, restoring familiarity.\n\nThis oscillation between shock and stability helps keep the audience engaged without oversaturating them with gimmicks.\n\n📊 In essence: We leveraged novelty to reinvigorate the audience, and now we anchor the campaign with a return to the classic. This rhythm is key to long-term campaign health."
};

interface AIChatProps {
  onClose: () => void;
}

export const AIChat = ({ onClose }: AIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your Campaign Analyst. Ask me about campaign performance, engagement patterns, or strategy recommendations.' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userQuestion = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setInput('');
    setIsTyping(true);

    // Simulate a delay to make it feel more natural
    setTimeout(() => {
      let answer = "I don't have information on that specific question. Could you try asking about engagement changes between days 14-21, 21-28, or about sustainability?";

      // Check if the question is in our predefined answers or similar enough
      for (const [question, response] of Object.entries(predefinedAnswers)) {
        if (userQuestion.toLowerCase().includes(question.toLowerCase()) || 
            question.toLowerCase().includes(userQuestion.toLowerCase())) {
          answer = response;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DialogContent className="max-w-md md:max-w-2xl p-0 border-0 rounded-xl shadow-2xl bg-gray-900 text-gray-100 overflow-hidden">
      <div className="flex flex-col h-[80vh] max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center">
              <Bot size={18} className="text-cyan-300" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <h3 className="font-medium text-white">Campaign Analyst</h3>
              <p className="text-xs text-gray-400">Online | Powered by AI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 max-w-[80%] rounded-2xl px-4 py-3 border border-gray-700 rounded-tl-none">
                <div className="flex space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about campaign engagement..."
              className="flex-1 bg-gray-800 border-gray-700 focus-visible:ring-cyan-500 text-gray-100 placeholder:text-gray-500"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white"
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Try asking: "Why did engagement drop from day 14 to day 21?"
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
