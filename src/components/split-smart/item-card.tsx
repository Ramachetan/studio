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
import { Pencil, Save, Trash2 } from 'lucide-react';

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
  
  return (
    <TooltipProvider>
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
              {isEditing ? (
                 <div className="flex items-center gap-2">
                    <Input 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-8"
                    />
                 </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                      {item.quantity > 1 ? `${item.quantity} x ${formatCurrency(item.price / item.quantity)}` : 'Single item'}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="h-8 w-24"
                    step="0.01"
                  />
                  <Button size="icon" className="h-8 w-8" onClick={handleSave} aria-label="Save changes">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="secondary" className="text-base font-semibold py-1 px-3">
                      {formatCurrency(item.price)}
                  </Badge>

                  <div className="flex space-x-1">
                      {people.map(person => (
                      <Tooltip key={person.id}>
                          <TooltipTrigger asChild>
                          <motion.button
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onAssignmentChange(item.id, person.id)}
                              aria-label={`Assign to ${person.name}`}
                              className={cn(
                                  'flex flex-col items-center gap-1 p-1 rounded-md transition-all',
                                  assignments.includes(person.id) ? 'bg-accent/20' : 'opacity-50 hover:opacity-100'
                              )}
                          >
                              <div className={cn(
                                  'h-8 w-8 border-2 rounded-full flex items-center justify-center text-lg',
                                  assignments.includes(person.id) ? 'border-accent' : 'border-transparent'
                              )}>
                                  <span>{person.emoji}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{person.name}</span>
                          </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                          <p>{assignments.includes(person.id) ? 'Unassign from' : 'Assign to'} {person.name}</p>
                          </TooltipContent>
                      </Tooltip>
                      ))}
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(true)} aria-label="Edit item">
                      <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onItemDelete(item.id)} aria-label="Delete item">
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
