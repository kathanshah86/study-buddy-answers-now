
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

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
        "max-w-[85%] rounded-2xl p-4 shadow-sm",
        isBot 
          ? "bg-white border border-gray-100 rounded-tl-none" 
          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
      )}>
        {isBot && (
          <div className="flex items-center mb-2">
            <Bot size={18} className="mr-2 text-blue-500" />
            <span className="font-medium text-blue-600">Study Buddy</span>
          </div>
        )}
        
        {!isBot && (
          <div className="flex items-center mb-2 justify-end">
            <span className="font-medium text-blue-100">You</span>
            <User size={18} className="ml-2 text-blue-100" />
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
