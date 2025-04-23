
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={cn(
      "flex w-full mb-4",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl p-4",
        isBot 
          ? "bg-blue-100 rounded-tl-none" 
          : "bg-blue-500 text-white rounded-tr-none"
      )}>
        {isBot && (
          <div className="flex items-center mb-1">
            <Bot size={16} className="mr-1" />
            <span className="font-medium">Study Buddy</span>
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className={cn(
          "text-xs mt-1 text-right", 
          isBot ? "text-gray-500" : "text-blue-100"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
