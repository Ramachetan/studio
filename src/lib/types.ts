import type { ParseReceiptOutput } from "@/ai/flows/parse-receipt";

export interface Item extends NonNullable<ParseReceiptOutput['items']>[0] {
  id: string;
}

export interface Person {
  id: string;
  name: string;
  color: string;
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
