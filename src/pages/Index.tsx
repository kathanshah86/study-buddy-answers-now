
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, Lightbulb, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  const renderSuggestions = () => {
    const suggestions = [
      "What is photosynthesis?",
      "Explain Newton's laws of motion",
      "How does mitosis work?",
      "What caused World War II?"
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 mb-6 max-w-2xl mx-auto px-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="hover:bg-blue-50 transition-colors cursor-pointer border-blue-200"
            onClick={() => handleSendMessage(suggestion)}
          >
            <CardContent className="p-3 flex items-center">
              <Lightbulb size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-left">{suggestion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center">
          <BrainCircuit size={30} className="mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Study Buddy</h1>
            <p className="text-sm opacity-90">Your AI Study Assistant</p>
          </div>
        </div>
      </header>
      
      {/* Chat Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 py-6 px-4">
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
              <span className="ml-2">Study Buddy is thinking...</span>
            </div>
          )}
          
          {messages.length === 1 && renderSuggestions()}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white shadow-lg">
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
