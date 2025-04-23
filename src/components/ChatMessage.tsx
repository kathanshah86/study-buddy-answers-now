
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { BookOpen, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={cn(
      "flex w-full mb-6",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-2xl p-4 shadow-sm transition-all",
        isBot 
          ? "bg-white border border-purple-100 rounded-tl-none" 
          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-none"
      )}>
        {isBot && (
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
              <BookOpen size={16} className="text-purple-600" />
            </div>
            <span className="font-medium text-purple-700">NCERT Buddy</span>
          </div>
        )}
        
        {!isBot && (
          <div className="flex items-center mb-2 justify-end">
            <span className="font-medium text-blue-100">You</span>
            <div className="w-8 h-8 rounded-full bg-blue-400 ml-2 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        )}
        
        <div className={cn(
          "text-sm whitespace-pre-wrap",
          isBot ? "text-gray-700" : "text-white"
        )}>
          {message.content}
        </div>
        
        <div className={cn(
          "text-xs mt-2 text-right", 
          isBot ? "text-gray-400" : "text-blue-100"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
