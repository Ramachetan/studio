'use client';

import { useState, useCallback, useRef, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseReceipt, type ParseReceiptInput, type ParseReceiptOutput } from '@/ai/flows/parse-receipt';

interface ReceiptUploaderProps {
  onReceiptParsed: (data: ParseReceiptOutput, imageUri?: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onError: (message: string) => void;
  customPrompt?: string;
}

const sampleReceipt: ParseReceiptOutput = {
  items: [
    { name: 'Avocado Toast', quantity: 1, price: 12.50 },
    { name: 'Iced Latte', quantity: 2, price: 11.00 },
    { name: 'Croissant', quantity: 1, price: 4.25 },
    { name: 'Orange Juice', quantity: 1, price: 5.00 },
    { name: 'Breakfast Burrito', quantity: 1, price: 14.75 },
    { name: 'Side of Bacon', quantity: 1, price: 4.00 },
    { name: 'Member Discount', quantity: 1, price: -3.50 },
    { name: 'Weekend Special', quantity: 1, price: -2.00 },
  ],
  tax: 3.28,
  total: 49.28,
};


export function ReceiptUploader({ onReceiptParsed, setIsLoading, onError, customPrompt }: ReceiptUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        onError('Please upload an image file.');
        return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      try {
        const input: ParseReceiptInput = { 
          receiptDataUri: dataUri,
          customPrompt: customPrompt 
        };
        const result = await parseReceipt(input);
        onReceiptParsed(result, dataUri);
      } catch (error) {
        console.error(error);
        onError('Failed to parse the receipt. The AI may be unavailable or the image may be unreadable. Please try again.');
      }
    };
    reader.onerror = () => {
        onError('Failed to read the file.');
        setIsLoading(false);
    }
    reader.readAsDataURL(file);
  }, [onReceiptParsed, setIsLoading, onError, customPrompt]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFormDrag = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleSampleReceipt = () => {
    setIsLoading(true);
    // Simulate a short delay for a better UX, like the AI is "parsing" it.
    setTimeout(() => {
      onReceiptParsed(sampleReceipt);
    }, 800);
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-xl border-0 bg-gradient-to-br from-card to-secondary/20">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-xl md:text-2xl">📷 Upload Your Receipt</CardTitle>
        <CardDescription className="text-sm md:text-base">Let AI do the hard work. Supports Costco, warehouse stores & more!</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <form id="form-file-upload" onDragEnter={handleFormDrag} onSubmit={(e) => e.preventDefault()}>
          <div 
            className={`relative flex flex-col items-center justify-center w-full h-40 md:h-48 rounded-xl transition-all duration-300 border-2 border-dashed ${dragActive ? 'bg-primary/10 border-primary scale-[1.02]' : 'bg-background/50 border-primary/30 hover:border-primary/60 hover:bg-muted/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex gap-3 mb-4">
                <Button 
                  type="button"
                  variant="default" 
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={handleTakePhoto}
                >
                  <Camera className="w-5 h-5" />
                  <span>Take Photo</span>
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={handleUploadClick}
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Upload</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="hidden md:inline">or drag and drop • </span>PNG, JPG, HEIC, or PDF
              </p>
            </div>
            {/* Hidden input for camera capture */}
            <input 
              ref={cameraInputRef}
              type="file" 
              className="hidden" 
              accept="image/*" 
              capture="environment" 
              onChange={handleChange} 
            />
            {/* Hidden input for file upload */}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleChange} 
            />
          </div>
        </form>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">✨ Handles discounts, coupons & negative values</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleSampleReceipt}>
            Try with sample receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
