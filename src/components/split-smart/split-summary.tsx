'use client';

import { useMemo } from 'react';
import { Copy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Person, Totals } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SplitSummaryProps {
  people: Person[];
  totals: Totals;
  tax: number;
  receiptTotal: number;
}

export function SplitSummary({ people, totals, tax, receiptTotal }: SplitSummaryProps) {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculatedSubtotal = useMemo(() => {
    return Object.values(totals).reduce((acc, personTotal) => acc + personTotal.items.reduce((itemAcc, item) => itemAcc + item.price, 0), 0);
  }, [totals]);

  const calculatedTotal = useMemo(() => {
    const totalTax = tax || 0;
    const itemsTotal = Object.values(totals).reduce((acc, personTotal) => acc + personTotal.total, 0);
    // The total from `totals` already includes tax, so we need to be careful.
    // Let's recalculate from subtotal + tax
    const sub = Object.values(totals).reduce((acc, personTotal) => {
        return acc + personTotal.items.reduce((iacc, i) => iacc + i.price, 0);
    }, 0);
    
    const assignedItemsTotal = Object.values(totals).reduce((acc, personTotal) => acc + personTotal.total, 0);
    return assignedItemsTotal;


  }, [totals, tax, people]);

  const difference = useMemo(() => receiptTotal - calculatedTotal, [receiptTotal, calculatedTotal]);

  const copySummaryToClipboard = () => {
    let summaryText = `SplitSmart Summary\n====================\n\n`;
    people.forEach(person => {
      const personTotals = totals[person.id];
      if (!personTotals) return;

      summaryText += `${person.emoji} ${person.name} owes ${formatCurrency(personTotals.total)}\n`;
      
      personTotals.items.forEach(item => {
        summaryText += `  - ${item.name}: ${formatCurrency(item.price)}\n`;
      });
      
      const subtotal = personTotals.items.reduce((acc, item) => acc + item.price, 0);
      const taxShare = personTotals.total - subtotal;
      if (taxShare > 0.005) { // Check if tax share is meaningful
          summaryText += `  - Share of Tax: ${formatCurrency(taxShare)}\n`;
      }
      summaryText += `\n`;
    });
    
    summaryText += `\n--------------------\n`;
    summaryText += `Subtotal: ${formatCurrency(calculatedSubtotal)}\n`;
    summaryText += `Tax: ${formatCurrency(tax)}\n`;
    summaryText += `Total: ${formatCurrency(receiptTotal)}\n`;

    navigator.clipboard.writeText(summaryText).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "You can now share the split summary.",
      });
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy summary to clipboard.",
      });
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          <span>Bill Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full" defaultValue={people[0]?.id}>
            {people.map(person => (
                <AccordionItem value={person.id} key={person.id}>
                    <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <div className={`w-full h-full flex items-center justify-center text-xl`}>
                                      {person.emoji}
                                    </div>
                                </Avatar>
                                <span className="font-medium">{person.name}</span>
                            </div>
                            <span className="font-semibold text-primary">{formatCurrency(totals[person.id]?.total || 0)}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 space-y-1 text-sm text-muted-foreground">
                        {totals[person.id]?.items.map((item, index) => (
                           <div key={index} className="flex justify-between">
                             <span>{item.name}</span>
                             <span>{formatCurrency(item.price)}</span>
                           </div> 
                        ))}
                         {tax > 0 && people.length > 0 && (
                            <div className="flex justify-between pt-2 border-t">
                                <span>Share of Tax</span>
                                <span>{formatCurrency(totals[person.id].total - totals[person.id].items.reduce((acc, i) => acc + i.price, 0))}</span>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        
        <Separator />

        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (Items)</span>
                <span>{formatCurrency(calculatedSubtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold">
                <span className="text-foreground">Calculated Total</span>
                <span>{formatCurrency(calculatedTotal)}</span>
            </div>
            <div className="flex justify-between font-semibold">
                <span className="text-foreground">Receipt Total</span>
                <span>{formatCurrency(receiptTotal)}</span>
            </div>
            {Math.abs(difference) > 0.01 && (
                <div className="flex justify-between pt-1">
                    <Badge variant={difference < 0 ? "outline" : "destructive"}>
                        Difference: {formatCurrency(difference)}
                    </Badge>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-accent hover:bg-accent/90" onClick={copySummaryToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copy & Share Summary
        </Button>
      </CardFooter>
    </Card>
  );
}
