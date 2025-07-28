'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PeopleManager } from './people-manager';
import { ItemCard } from './item-card';
import { SplitSummary } from './split-summary';
import type { ParseReceiptOutput } from '@/ai/flows/parse-receipt';
import type { Item, Person, Assignments, Totals } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { getNextEmoji } from '@/lib/person-emojis';

interface SplitViewProps {
  receipt: ParseReceiptOutput;
}

export function SplitView({ receipt }: SplitViewProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({});

  useEffect(() => {
    const initialItems = receipt.items.map((item, index) => ({
      ...item,
      id: `item-${index}`,
    }));
    setItems(initialItems);
  }, [receipt.items]);

  useEffect(() => {
    // Initialize with a default person "Me"
    if (people.length === 0) {
      setPeople([{ id: `person-${Date.now()}`, name: 'Me', color: 'bg-primary', emoji: getNextEmoji(0) }]);
    }
  }, [people.length]);

  const handleAssignmentChange = (itemId: string, personId: string) => {
    setAssignments(prev => {
      const currentAssignees = prev[itemId] || [];
      const isAssigned = currentAssignees.includes(personId);
      const newAssignees = isAssigned
        ? currentAssignees.filter(id => id !== personId)
        : [...currentAssignees, personId];
      
      return { ...prev, [itemId]: newAssignees };
    });
  };

  const handleItemUpdate = (itemId: string, newName: string, newPrice: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, name: newName, price: newPrice } : item
      )
    );
  };

  const totals = useMemo<Totals>(() => {
    const newTotals: Totals = {};
    people.forEach(p => {
      newTotals[p.id] = { total: 0, items: [] };
    });

    items.forEach(item => {
      const itemAssignees = assignments[item.id] || [];
      if (itemAssignees.length > 0) {
        const pricePerPerson = item.price / itemAssignees.length;
        itemAssignees.forEach(personId => {
          if (newTotals[personId]) {
            newTotals[personId].total += pricePerPerson;
            newTotals[personId].items.push({ name: item.name, price: pricePerPerson });
          }
        });
      }
    });

    if (receipt.tax && people.length > 0) {
        const taxPerPerson = receipt.tax / people.length;
        people.forEach(p => {
            if(newTotals[p.id]) {
                newTotals[p.id].total += taxPerPerson;
            }
        });
    }

    return newTotals;
  }, [assignments, items, people, receipt.tax]);

  const receiptTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0) + receipt.tax;
  }, [items, receipt.tax])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-2">
        <Card className="mb-6 shadow-md">
          <CardContent className="p-4">
            <PeopleManager people={people} setPeople={setPeople} />
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold mb-4 text-foreground">Tap to Assign Items</h2>
        <div className="space-y-3">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <ItemCard 
                        item={item} 
                        people={people}
                        assignments={assignments[item.id] || []}
                        onAssignmentChange={handleAssignmentChange}
                        onItemUpdate={handleItemUpdate}
                    />
                </motion.div>
              ))}
            </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-8">
            <SplitSummary 
                people={people} 
                totals={totals}
                tax={receipt.tax}
                receiptTotal={receiptTotal}
            />
        </div>
      </div>
    </div>
  );
}
