'use client';

import { useState, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
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
  ],
  tax: 3.75,
  total: 52.75,
};


export function ReceiptUploader({ onReceiptParsed, setIsLoading, onError, customPrompt }: ReceiptUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors duration-300">
      <CardHeader>
        <CardTitle>Upload Your Receipt</CardTitle>
        <CardDescription>Let AI do the hard work. Drag & drop or click to upload.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-file-upload" onDragEnter={handleFormDrag} onSubmit={(e) => e.preventDefault()}>
          <label 
            htmlFor="input-file-upload" 
            className={`relative flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition-colors ${dragActive ? 'bg-primary/10' : 'bg-background hover:bg-muted'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-primary/80" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
            </div>
            <input id="input-file-upload" type="file" className="hidden" accept="image/*" onChange={handleChange} />
          </label>
           {dragActive && <div className="absolute inset-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>
         <Button variant="link" className="mt-4" onClick={handleSampleReceipt}>Or try with a sample receipt</Button>
      </CardContent>
    </Card>
  );
}
