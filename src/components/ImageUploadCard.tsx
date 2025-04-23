
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Check, Edit, Image, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ImageUploadCardProps {
  onClose: () => void;
  onComplete: (text: string) => void;
}

export function ImageUploadCard({ onClose, onComplete }: ImageUploadCardProps) {
  const [stage, setStage] = useState<'upload' | 'processing' | 'confirm'>('upload');
  const [extractedText, setExtractedText] = useState("");
  
  // Mock OCR function - in a real app, this would call an API
  const simulateOCR = () => {
    setStage('processing');
    // Simulate API delay
    setTimeout(() => {
      setExtractedText("What is the process of photosynthesis and how do plants convert light energy into chemical energy?");
      setStage('confirm');
    }, 2000);
  };

  const handleConfirm = () => {
    onComplete(extractedText);
  };

  return (
    <Card className="mb-6 border-purple-200 shadow-lg overflow-hidden animate-fade-in">
      <CardContent className="p-5">
        {stage === 'upload' && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">🖼️ Snap Your Doubt</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-5">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 px-6 border-purple-200 hover:bg-purple-50"
                onClick={simulateOCR}
              >
                <Camera size={32} className="mb-2 text-purple-600" />
                <span>Take Photo</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 px-6 border-purple-200 hover:bg-purple-50"
                onClick={simulateOCR}
              >
                <Image size={32} className="mb-2 text-purple-600" />
                <span>Upload Image</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500">I'll read your question from the image</p>
          </div>
        )}
        
        {stage === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <Image size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-purple-700 font-medium">Reading your image...</p>
            <div className="mt-2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span 
                  key={i} 
                  className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></span>
              ))}
            </div>
          </div>
        )}
        
        {stage === 'confirm' && (
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-purple-800">Here's what I read from your image:</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500" 
                onClick={onClose}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md border border-purple-100 mb-4">
              <Textarea 
                value={extractedText} 
                onChange={(e) => setExtractedText(e.target.value)} 
                className="min-h-[100px] border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                className="border-purple-200" 
                onClick={() => setStage('upload')}
              >
                <Edit size={16} className="mr-1" />
                <span>Retake</span>
              </Button>
              
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleConfirm}
              >
                <Check size={16} className="mr-1" />
                <span>Confirm</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
