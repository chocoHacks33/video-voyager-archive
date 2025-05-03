
import React, { useState } from 'react';
import { UserRound, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AIChat from '@/components/campaign/AIChat';
import { cn } from '@/lib/utils';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIAnalyst = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Process and add AI response
    setTimeout(() => {
      const aiResponse = AIChat.getResponse(inputValue);
      const aiMessage: Message = {
        role: 'ai',
        content: aiResponse
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-30">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 p-0 flex items-center justify-center animate-pulse-slow"
            onClick={() => setIsOpen(true)}
          >
            <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
            <UserRound className="h-7 w-7 text-white" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[350px] sm:w-[450px] p-0 bg-gray-900/95 backdrop-blur-lg border border-purple-900/50 shadow-2xl rounded-2xl"
          side="top"
          align="end"
          sideOffset={20}
        >
          <div className="flex flex-col max-h-[500px] h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-800/80 bg-gradient-to-r from-purple-900/70 to-gray-900/80 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
                  <UserRound className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Campaign Analyst</h3>
                  <p className="text-xs text-gray-300">AI-powered insights for your campaigns</p>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-600/40 flex items-center justify-center">
                    <UserRound className="h-7 w-7 text-purple-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-200">Ask Campaign Analyst</h3>
                    <p className="text-sm text-gray-400 max-w-xs">Get insights about your campaign performance and optimization suggestions</p>
                  </div>
                  <div className="space-y-2 w-full max-w-xs">
                    <Button 
                      variant="ghost" 
                      className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 justify-start"
                      onClick={() => {
                        setInputValue("Why did engagement drop from day 14 to day 21?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      Why did engagement drop from day 14 to day 21?
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 justify-start"
                      onClick={() => {
                        setInputValue("Why did engagement rise so rapidly from day 21 to day 28?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      Why did engagement rise so rapidly from day 21 to day 28?
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 justify-start"
                      onClick={() => {
                        setInputValue("Is this sustainable?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      Is this sustainable?
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2",
                        message.role === 'user' 
                          ? "bg-purple-600 text-white rounded-tr-none animate-appear" 
                          : "bg-gray-800 text-gray-100 rounded-tl-none animate-appear"
                      )}
                    >
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: message.content}} />
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-gray-800/80 bg-gray-900/90">
              <div className="flex space-x-2">
                <textarea 
                  className="flex-1 bg-gray-800/80 text-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-500 text-sm resize-none h-10 max-h-24 overflow-y-auto"
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  style={{
                    minHeight: '40px',
                    height: 'auto'
                  }}
                />
                <Button 
                  className="h-10 w-10 p-0 rounded-xl bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <SendHorizontal className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AIAnalyst;
