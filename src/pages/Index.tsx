
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: "Hi there! I'm Study Buddy, your AI study assistant. Ask me any academic questions you have, and I'll do my best to help you learn!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { content }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: uuidv4(),
        content: data.answer,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-bold">Study Buddy</h1>
        <p className="text-sm opacity-80">Your AI Study Assistant</p>
      </header>
      
      {/* Chat Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center text-sm text-gray-500 ml-2 mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
              <span className="ml-2">Study Buddy is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
