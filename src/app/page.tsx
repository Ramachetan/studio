'use client';

import { useState } from 'react';
import type { ParseReceiptOutput } from '@/ai/flows/parse-receipt';
import { DEFAULT_PROMPT } from '@/lib/constants';
import { ReceiptUploader } from '@/components/split-smart/receipt-uploader';
import { SplitView } from '@/components/split-smart/split-view';
import { SettingsModal } from '@/components/split-smart/settings-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/split-smart/logo';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [receiptData, setReceiptData] = useState<ParseReceiptOutput | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_PROMPT);
  const { toast } = useToast();

  const handleReceiptParsed = (data: ParseReceiptOutput, imageUri?: string) => {
    if (!data.items || data.items.length === 0) {
       toast({
        variant: 'destructive',
        title: 'Parsing Error',
        description: 'The AI could not find any items on the receipt. Please try another image.',
      });
      setIsLoading(false);
      return;
    }
    setReceiptData(data);
    setReceiptImage(imageUri || null);
    setIsLoading(false);
  };

  const handleReset = () => {
    setReceiptData(null);
    setReceiptImage(null);
  };

  const handleError = (message: string) => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });
    setIsLoading(false);
  };

  const handlePromptUpdate = (newPrompt: string) => {
    setCustomPrompt(newPrompt);
    toast({
      title: 'Settings Updated',
      description: 'Your custom prompt has been saved.',
    });
  };
  
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-4xl mx-auto px-3 py-4 md:px-8 md:py-6">
        <header className="flex justify-between items-center w-full mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Logo className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SplitSmart</h1>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <SettingsModal 
              currentPrompt={customPrompt}
              onPromptUpdate={handlePromptUpdate}
            />
            {receiptData && (
               <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={handleReset}>New Split</Button>
            )}
          </div>
        </header>
        
        <div className="w-full">
          {isLoading ? (
            <div className="w-full">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : receiptData ? (
            <SplitView receipt={receiptData} receiptImage={receiptImage} />
          ) : (
            <ReceiptUploader 
              onReceiptParsed={handleReceiptParsed} 
              setIsLoading={setIsLoading}
              onError={handleError}
              customPrompt={customPrompt}
            />
          )}
        </div>
      </div>
    </main>
  );
}
