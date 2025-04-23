
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, BrainCircuit, Camera, Image, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploadCard } from "@/components/ImageUploadCard";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: "Hi there! I'm NCERT Buddy, your AI study assistant. Upload an image of your doubt or ask me directly!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [showUploadCard, setShowUploadCard] = useState(false);
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

  const handleImageUpload = (imageText: string) => {
    if (imageText.trim()) {
      handleSendMessage(`Here's my doubt from the image: ${imageText}`);
    }
    setShowUploadCard(false);
  };

  const renderSuggestions = () => {
    const suggestions = [
      "Explain the process of photosynthesis",
      "How do I solve linear equations?",
      "What are the properties of acids and bases?",
      "Explain Newton's laws of motion"
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 mb-6 max-w-2xl mx-auto px-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="hover:bg-blue-50 transition-colors cursor-pointer border-blue-200 hover:shadow-md"
            onClick={() => handleSendMessage(suggestion)}
          >
            <CardContent className="p-3 flex items-center">
              <BookOpen size={16} className="text-purple-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-left">{suggestion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderUploadOptions = () => {
    const options = [
      { icon: Camera, label: "Take Photo", action: () => setShowUploadCard(true) },
      { icon: Image, label: "Upload Image", action: () => setShowUploadCard(true) },
      { icon: Mic, label: "Voice Question", action: () => toast({ title: "Coming Soon!", description: "Voice input will be available soon!" }) }
    ];

    return (
      <div className="flex flex-wrap justify-center gap-3 mb-6 mt-2 max-w-2xl mx-auto px-4">
        {options.map((option, index) => (
          <Card 
            key={index} 
            className="w-full md:w-[calc(33%-0.75rem)] cursor-pointer border-purple-200 hover:bg-purple-50 transition-all hover:shadow-md"
            onClick={option.action}
          >
            <CardContent className="p-3 flex flex-col items-center">
              <option.icon size={24} className="text-purple-600 mb-1" />
              <p className="text-sm font-medium">{option.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-blue-600 text-white py-6 px-6 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center">
          <BrainCircuit size={30} className="mr-3" />
          <div>
            <h1 className="text-2xl font-bold">NCERT Buddy</h1>
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
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
              <span className="ml-2">NCERT Buddy is thinking...</span>
            </div>
          )}
          
          {messages.length === 1 && (
            <>
              <div className="text-center my-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-4">🖼️ Snap Your Doubt</h2>
                {renderUploadOptions()}
              </div>
              {renderSuggestions()}
            </>
          )}
          
          {showUploadCard && (
            <ImageUploadCard onClose={() => setShowUploadCard(false)} onComplete={handleImageUpload} />
          )}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-purple-100 bg-white shadow-lg">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isTyping || showUploadCard}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
