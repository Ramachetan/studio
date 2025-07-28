'use server';

/**
 * @fileOverview An AI agent that parses receipts and extracts items, quantities, prices, and taxes.
 *
 * - parseReceipt - A function that handles the receipt parsing process.
 * - ParseReceiptInput - The input type for the parseReceipt function.
 * - ParseReceiptOutput - The return type for the parseReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseReceiptInput = z.infer<typeof ParseReceiptInputSchema>;

const ParseReceiptOutputSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().describe('The name of the item.'),
      quantity: z.number().describe('The quantity of the item.'),
      price: z.number().describe('The price of the item.'),
    })
  ).describe('The items parsed from the receipt.'),
  tax: z.number().describe('The tax amount on the receipt.'),
  total: z.number().describe('The total amount on the receipt.'),
});
export type ParseReceiptOutput = z.infer<typeof ParseReceiptOutputSchema>;

export async function parseReceipt(input: ParseReceiptInput): Promise<ParseReceiptOutput> {
  return parseReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseReceiptPrompt',
  input: {schema: ParseReceiptInputSchema},
  output: {schema: ParseReceiptOutputSchema},
  prompt: `You are an expert receipt parser. You will extract the items, quantities, prices, tax, and total from the receipt.

  Return the data in JSON format.

  Receipt: {{media url=receiptDataUri}}`,
});

const parseReceiptFlow = ai.defineFlow(
  {
    name: 'parseReceiptFlow',
    inputSchema: ParseReceiptInputSchema,
    outputSchema: ParseReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
