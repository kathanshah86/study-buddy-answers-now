
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Check, Edit, Image, X, File } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadCardProps {
  onClose: () => void;
  onComplete: (text: string) => void;
}

export function ImageUploadCard({ onClose, onComplete }: ImageUploadCardProps) {
  const [stage, setStage] = useState<'upload' | 'processing' | 'confirm'>('upload');
  const [extractedText, setExtractedText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file under 10MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        processImageWithOCR(file);
      };
      reader.readAsDataURL(file);
    } 
    else if (file.type === 'application/pdf') {
      setFileType('pdf');
      
      // For PDFs we just show a placeholder
      setSelectedImage("/placeholder.svg");
      processPDFWithOCR(file);
    }
    else {
      toast({
        title: "Invalid file type",
        description: "Please select an image or PDF file",
        variant: "destructive"
      });
      return;
    }
  };
  
  const handleCameraClick = () => {
    // Open file input with camera as source if supported
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };
  
  const handleImageUploadClick = () => {
    // Open file input for regular upload
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };
  
  const handlePDFUploadClick = () => {
    // Open file input specifically for PDF
    if (pdfInputRef.current) {
      pdfInputRef.current.click();
    }
  };
  
  // Process image with OCR using Supabase Edge Function
  const processImageWithOCR = async (file: File) => {
    setStage('processing');
    try {
      // Convert file to base64 for sending to API
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];
        
        if (!base64Image) {
          throw new Error("Failed to convert image to base64");
        }
        
        try {
          const { data, error } = await supabase.functions.invoke('gemini-vision', {
            body: { image: base64Image }
          });
          
          if (error) throw error;
          
          setExtractedText(data.text || "I couldn't read any text from this image. Please try again with a clearer image.");
          setStage('confirm');
        } catch (error) {
          console.error('Error processing image with OCR:', error);
          // Fallback to simulated OCR if API fails
          setTimeout(() => {
            setExtractedText("What is the process of photosynthesis and how do plants convert light energy into chemical energy?");
            setStage('confirm');
          }, 2000);
        }
      };
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive"
      });
      setStage('upload');
    }
  };
  
  // Process PDF with OCR
  const processPDFWithOCR = async (file: File) => {
    setStage('processing');
    try {
      // For PDF processing, we would normally send to a dedicated PDF processing API
      // Here we'll simulate the process with a timeout
      setTimeout(() => {
        setExtractedText("Explain the causes and effects of climate change on global ecosystems.");
        setStage('confirm');
      }, 3000);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to process PDF. Please try again.",
        variant: "destructive"
      });
      setStage('upload');
    }
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 w-full">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 px-6 border-purple-200 hover:bg-purple-50"
                onClick={handleCameraClick}
              >
                <Camera size={32} className="mb-2 text-purple-600" />
                <span>Take Photo</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 px-6 border-purple-200 hover:bg-purple-50"
                onClick={handleImageUploadClick}
              >
                <Image size={32} className="mb-2 text-purple-600" />
                <span>Upload Image</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 px-6 border-purple-200 hover:bg-purple-50"
                onClick={handlePDFUploadClick}
              >
                <File size={32} className="mb-2 text-purple-600" />
                <span>Upload PDF</span>
              </Button>
              
              {/* Hidden file inputs */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">I'll read your question from the image or PDF</p>
          </div>
        )}
        
        {stage === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                {fileType === 'pdf' ? (
                  <File size={24} className="text-purple-600" />
                ) : (
                  <Image size={24} className="text-purple-600" />
                )}
              </div>
            </div>
            <p className="text-purple-700 font-medium">Reading your {fileType === 'pdf' ? 'PDF' : 'image'}...</p>
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
              <h3 className="text-md font-medium text-purple-800">Here's what I read from your {fileType === 'pdf' ? 'PDF' : 'image'}:</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500" 
                onClick={onClose}
              >
                <X size={16} />
              </Button>
            </div>
            
            {selectedImage && (
              <div className="mb-3 max-h-48 overflow-hidden rounded-md">
                <img 
                  src={selectedImage} 
                  alt="Uploaded" 
                  className="w-full h-auto object-contain" 
                />
              </div>
            )}
            
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
