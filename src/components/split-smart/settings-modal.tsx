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
        <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10" title="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col mx-2">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">⚙️ AI Prompt Settings</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Customize how the AI parses your receipts. The default prompt handles Costco-style receipts with discounts.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm">AI Prompt</Label>
            <Textarea
              id="prompt"
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              placeholder="Enter your custom prompt..."
              className="min-h-[150px] md:min-h-[200px] resize-none text-xs md:text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 md:p-3 rounded-lg">
            <p><strong>Note:</strong> Keep the <code className="text-[10px] md:text-xs bg-muted px-1 py-0.5 rounded">{'{{media url=receiptDataUri}}'}</code> placeholder to include the receipt image.</p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="w-full sm:w-auto">
            Reset to Default
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleCancel} className="flex-1 sm:flex-initial">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="flex-1 sm:flex-initial">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
