'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DEFAULT_PROMPT } from '@/lib/constants';

interface SettingsModalProps {
  currentPrompt: string;
  onPromptUpdate: (newPrompt: string) => void;
}

export function SettingsModal({ currentPrompt, onPromptUpdate }: SettingsModalProps) {
  const [tempPrompt, setTempPrompt] = useState(currentPrompt);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onPromptUpdate(tempPrompt);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempPrompt(DEFAULT_PROMPT);
  };

  const handleCancel = () => {
    setTempPrompt(currentPrompt);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Prompt Settings</DialogTitle>
          <DialogDescription>
            Customize the prompt that the AI uses to parse your receipts. The prompt should instruct the AI to extract items, quantities, prices, tax, and total.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">AI Prompt</Label>
            <Textarea
              id="prompt"
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              placeholder="Enter your custom prompt..."
              className="min-h-[200px] resize-none"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p><strong>Note:</strong> Keep the <code>{'{{media url=receiptDataUri}}'}</code> placeholder to include the receipt image.</p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
