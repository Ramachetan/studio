import type { ParseReceiptOutput } from "@/ai/flows/parse-receipt";

export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Person {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface Assignments {
  [itemId: string]: string[];
}

export interface Totals {
  [personId: string]: {
    total: number;
    items: { name: string; price: number }[];
  };
}
