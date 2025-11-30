'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Item, Person } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, Trash2, Tag } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  people: Person[];
  assignments: string[];
  onAssignmentChange: (itemId: string, personId: string) => void;
  onItemUpdate: (itemId: string, newName: string, newPrice: number) => void;
  onItemDelete: (itemId: string) => void;
}

export function ItemCard({ item, people, assignments, onAssignmentChange, onItemUpdate, onItemDelete }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedPrice, setEditedPrice] = useState(item.price.toFixed(2));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleSave = () => {
    const newPrice = parseFloat(editedPrice);
    if (editedName.trim() && !isNaN(newPrice)) {
      onItemUpdate(item.id, editedName.trim(), newPrice);
      setIsEditing(false);
    }
  };
  
  const isDiscount = item.price < 0;
  
  return (
    <TooltipProvider>
        <Card className={cn(
          "overflow-hidden transition-all duration-300",
          isDiscount 
            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 shadow-green-100 dark:shadow-none" 
            : "shadow-sm hover:shadow-md"
        )}>
        <CardContent className="p-3 md:p-4">
          {/* Mobile-first layout */}
          <div className="flex flex-col gap-3">
            {/* Item info row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-grow min-w-0">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-9 text-sm"
                      placeholder="Item name"
                    />
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        className="h-9 w-28 text-sm"
                        step="0.01"
                        placeholder="Price"
                      />
                      <Button size="sm" className="h-9 px-3" onClick={handleSave} aria-label="Save changes">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isDiscount && <Tag className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className={cn(
                        "font-medium text-sm md:text-base truncate",
                        isDiscount ? "text-green-700 dark:text-green-300" : "text-foreground"
                      )}>{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isDiscount ? 'Discount / Savings' : (item.quantity > 1 ? `${item.quantity} × ${formatCurrency(item.price / item.quantity)}` : 'Single item')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {!isEditing && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge 
                    variant={isDiscount ? "outline" : "secondary"} 
                    className={cn(
                      "text-sm md:text-base font-semibold py-1 px-2 md:px-3",
                      isDiscount && "border-green-500 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50"
                    )}
                  >
                    {formatCurrency(item.price)}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(true)} aria-label="Edit item">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onItemDelete(item.id)} aria-label="Delete item">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* People assignment row - horizontal scroll on mobile */}
            {!isEditing && (
              <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {people.map(person => (
                  <Tooltip key={person.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAssignmentChange(item.id, person.id)}
                        aria-label={`Assign to ${person.name}`}
                        className={cn(
                          'flex flex-col items-center gap-0.5 p-1.5 md:p-2 rounded-lg transition-all min-w-[52px] md:min-w-[60px]',
                          assignments.includes(person.id) 
                            ? 'bg-accent/20 ring-2 ring-accent ring-offset-1' 
                            : 'opacity-60 hover:opacity-100 hover:bg-muted'
                        )}
                      >
                        <div className={cn(
                          'h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-lg md:text-xl transition-transform',
                          assignments.includes(person.id) && 'scale-110'
                        )}>
                          <span>{person.emoji}</span>
                        </div>
                        <span className="text-[10px] md:text-xs text-muted-foreground font-medium truncate max-w-full">{person.name}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{assignments.includes(person.id) ? 'Unassign from' : 'Assign to'} {person.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
