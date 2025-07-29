'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddItemFormProps {
  onAddItem: (name: string, price: number) => void;
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    if (name.trim() && !isNaN(priceValue)) {
      onAddItem(name.trim(), priceValue);
      setName('');
      setPrice('');
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <Input
            placeholder="New item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow"
          />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24"
            step="0.01"
          />
          <Button type="submit" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
