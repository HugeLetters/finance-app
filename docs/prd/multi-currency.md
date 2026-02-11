# PRD: Multi-Currency

## Summary
Support purchases in multiple currencies and display a preferred currency with access to original values.

## Goals
- Store original currency for each purchase.
- Display preferred currency with hover to reveal original.

## Non-Goals
- Real-time FX trading or advanced charts.

## User Stories
- As a user, I can enter purchases in any currency.
- As a user, I see totals in my preferred currency.
- As a user, I can hover to see original currency and amount.

## Functional Requirements
- Currency field on purchase and amount in original currency.
- Preference setting per user for display currency.
- FX conversion service with daily rate caching.
- Conversion timestamp stored per purchase.

## UX Notes
- Display format: preferred amount with subtle badge for original.
- Hover or focus reveals original amount and rate date.

## Data Model
- Purchase.currency, Purchase.amountOriginal, Purchase.amountDisplay, Purchase.fxRateId.
- FxRate: base, quote, rate, effectiveDate.

## Dependencies
- Settings UI for preferred currency.
- Database schema updates.

## Milestones
1. Schema and rate storage.
2. Input and display support in table.
3. Preferences UI and conversions.

## Risks
- Rate accuracy and update frequency.
- Consistency between stored and displayed values.
