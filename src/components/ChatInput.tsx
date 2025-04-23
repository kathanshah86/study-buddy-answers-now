
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, HelpCircle, BookOpen } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-white">
      <div className="relative flex-1">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your NCERT question..."
          className="min-h-[60px] resize-none pr-10 rounded-2xl border-purple-200 focus-visible:ring-purple-500"
          disabled={disabled}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                className="absolute bottom-2 right-2 h-6 w-6 text-purple-400 hover:text-purple-600"
              >
                <HelpCircle size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Press Enter to send<br />Shift+Enter for new line</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 h-10 rounded-full px-5 shadow-md" 
        disabled={disabled || !inputValue.trim()}
      >
        <Send size={18} className="mr-1" />
        <span>Send</span>
      </Button>
    </form>
  );
}
