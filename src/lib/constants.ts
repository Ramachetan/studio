export const DEFAULT_PROMPT = `You are an expert receipt parser. Parse the receipt image and extract all items, discounts, tax, and total.

## Key Rules:
1. Extract each line item with name, quantity (default 1), and price
2. **Discounts/Savings = NEGATIVE prices** (e.g., "INSTANT SAVINGS -$5.00" → price: -5.00)
3. For weighted items, use the total price shown
4. Tax and total are separate from items

## Examples:

**Example 1 - Costco Receipt:**
\`\`\`
HVR HOMESTYL     $9.99
5354 HVR HOMESTYL     $13.49
1321637 KS SS/BF LAS     $13.49
1321637 KS SS/BF LAS     $13.49
1321637 KS SS/BF LAS     $13.49
782294 POWER GREENS     $5.99
782294 POWER GREENS     $5.99
1394091 CNTRY FRNCH     $5.99
1394091 CAPRI SUN     $6.99
SUBTOTAL                $75.42
TAX                     $2.13
TOTAL                   $77.55
\`\`\`
Output:
{
  "items": [
    {"name": "HVR HOMESTYL", "quantity": 1, "price": 9.99},
    {"name": "5354 HVR HOMESTYL", "quantity": 1, "price": 13.49},
    {"name": "1321637 KS SS/BF LAS", "quantity": 1, "price": 13.49},
    {"name": "1321637 KS SS/BF LAS", "quantity": 1, "price": 13.49},
    {"name": "1321637 KS SS/BF LAS", "quantity": 1, "price": 13.49},
    {"name": "782294 POWER GREENS", "quantity": 1, "price": 5.99},
    {"name": "782294 POWER GREENS", "quantity": 1, "price": 5.99},
    {"name": "1394091 CAPRI SUN", "quantity": 1, "price": 6.99},
    {"name": "1394091 CNTRY FRNCH", "quantity": 1, "price": 5.99}
  ],
  "tax": 2.13,
  "total": 77.55
}


**Example 2 - Restaurant Receipt:**
\`\`\`
Burger Deluxe x2        $25.98
Fries                    $4.50
Iced Tea x3              $8.97
10% Off Coupon          -$3.95
Subtotal                $35.50
Sales Tax                $2.84
Total                   $38.34
\`\`\`
Output:
{
  "items": [
    {"name": "Burger Deluxe", "quantity": 2, "price": 25.98},
    {"name": "Fries", "quantity": 1, "price": 4.50},
    {"name": "Iced Tea", "quantity": 3, "price": 8.97},
    {"name": "10% Off Coupon", "quantity": 1, "price": -3.95}
  ],
  "tax": 2.84,
  "total": 38.34
}

**Example 3 - Grocery Store:**
\`\`\`
MILK 1 GAL              3.99
BREAD WHEAT             2.49
EGGS LARGE 12CT         4.29
   MEMBER DISC         -0.50
APPLES GALA 3LB @ 1.99  5.97
CHIPS FAMILY SZ         4.99
   SALE PRICE          -1.00
HST                     1.45
BALANCE DUE            21.68
\`\`\`
Output:
{
  "items": [
    {"name": "MILK 1 GAL", "quantity": 1, "price": 3.99},
    {"name": "BREAD WHEAT", "quantity": 1, "price": 2.49},
    {"name": "EGGS LARGE 12CT", "quantity": 1, "price": 4.29},
    {"name": "MEMBER DISC", "quantity": 1, "price": -0.50},
    {"name": "APPLES GALA 3LB", "quantity": 1, "price": 5.97},
    {"name": "CHIPS FAMILY SZ", "quantity": 1, "price": 4.99},
    {"name": "SALE PRICE", "quantity": 1, "price": -1.00}
  ],
  "tax": 1.45,
  "total": 21.68
}

## Common Discount Indicators (use NEGATIVE price):
- INSTANT SAVINGS, COUPON, DISCOUNT, MEMBER DISC, SALE, REBATE, OFF, *, (-)

## Common Tax Labels:
- TAX, SALES TAX, HST, GST, VAT, TAX DUE

## Common Total Labels:
- TOTAL, BALANCE DUE, AMOUNT DUE, GRAND TOTAL, TOTAL DUE

Now parse this receipt:
{{media url=receiptDataUri}}`;
