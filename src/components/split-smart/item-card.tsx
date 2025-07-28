'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

interface ItemCardProps {
  item: Item;
  people: Person[];
  assignments: string[];
  onAssignmentChange: (itemId: string, personId: string) => void;
}

export function ItemCard({ item, people, assignments, onAssignmentChange }: ItemCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  return (
    <TooltipProvider>
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">
                {item.quantity > 1 ? `${item.quantity} x ${formatCurrency(item.price / item.quantity)}` : 'Single item'}
            </p>
            </div>

            <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold py-1 px-3">
                {formatCurrency(item.price)}
            </Badge>

            <div className="flex -space-x-2">
                {people.map(person => (
                <Tooltip key={person.id}>
                    <TooltipTrigger asChild>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onAssignmentChange(item.id, person.id)}
                        aria-label={`Assign to ${person.name}`}
                    >
                        <Avatar className={cn(
                            'h-8 w-8 border-2 transition-all',
                            assignments.includes(person.id) ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-100'
                        )}>
                        <div className={`w-full h-full flex items-center justify-center text-primary-foreground text-xs ${person.color}`}>
                            {person.name.charAt(0).toUpperCase()}
                        </div>
                        <AvatarFallback>{person.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>{assignments.includes(person.id) ? 'Unassign from' : 'Assign to'} {person.name}</p>
                    </TooltipContent>
                </Tooltip>
                ))}
            </div>
            </div>
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
