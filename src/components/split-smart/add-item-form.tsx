'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AddItemFormProps {
  onAddItem: (name: string, price: number) => void;
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isDiscount, setIsDiscount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    if (name.trim() && !isNaN(priceValue)) {
      // Apply negative sign for discounts
      const finalPrice = isDiscount ? -Math.abs(priceValue) : priceValue;
      onAddItem(name.trim(), finalPrice);
      setName('');
      setPrice('');
      setIsDiscount(false);
    }
  };

  return (
    <Card className="shadow-md border-primary/10">
      <CardContent className="p-3 md:p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Input
              placeholder="Item or discount name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-grow text-sm md:text-base h-10"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-24 md:w-28 text-sm md:text-base h-10"
                step="0.01"
              />
              <Button 
                type="button" 
                variant={isDiscount ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-10 w-10 flex-shrink-0",
                  isDiscount && "bg-green-600 hover:bg-green-700"
                )}
                onClick={() => setIsDiscount(!isDiscount)}
                title={isDiscount ? "Adding as discount" : "Click to add as discount"}
              >
                <Tag className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" className="h-10 w-10 flex-shrink-0">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {isDiscount && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <Tag className="h-3 w-3" /> Adding as discount (negative value)
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
