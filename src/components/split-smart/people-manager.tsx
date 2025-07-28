'use client';

import { useState } from 'react';
import { Plus, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { getNextColor } from '@/lib/colors';
import { getNextEmoji } from '@/lib/person-emojis';
import type { Person } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PERSON_EMOJIS } from '@/lib/person-emojis';

interface PeopleManagerProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}

export function PeopleManager({ people, setPeople }: PeopleManagerProps) {
  const [name, setName] = useState('');

  const addPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && people.length < 10) {
      const newPerson: Person = {
        id: `person-${Date.now()}`,
        name: name.trim(),
        color: getNextColor(people.length),
        emoji: getNextEmoji(people.length),
      };
      setPeople(prev => [...prev, newPerson]);
      setName('');
    }
  };

  const removePerson = (id: string) => {
    // Cannot remove the first person ("Me")
    if (people.length > 0 && people[0].id === id) return;
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const updatePersonEmoji = (id: string, emoji: string) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, emoji } : p));
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <form onSubmit={addPerson} className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a person's name"
            className="flex-grow"
            aria-label="Add a new person's name"
          />
          <Button type="submit" size="icon" aria-label="Add person">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {people.map((person, index) => (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: index * 0.1 } }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative group"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="flex flex-col items-center gap-1 focus:outline-none">
                              <Avatar>
                                  <div className={`w-full h-full flex items-center justify-center text-xl`}>
                                      {person.emoji}
                                  </div>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{person.name}</span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click to change emoji</p>
                        </TooltipContent>
                    </Tooltip>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="grid grid-cols-6 gap-1">
                      {PERSON_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => updatePersonEmoji(person.id, emoji)} className="text-2xl p-1 rounded-md hover:bg-accent/50 transition-colors">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {index > 0 && ( // Do not allow removing the first person
                  <button
                    onClick={() => removePerson(person.id)}
                    className="absolute -top-1 -right-1 bg-secondary rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${person.name}`}
                  >
                    <X className="h-3 w-3 text-secondary-foreground" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
