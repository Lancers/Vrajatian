/**
 * Default master checklist of what a package does NOT cover — the
 * counterpart to INCLUSION_OPTIONS (lib/constants/inclusions.ts). Same
 * pattern: a plain string list checked against `exclusions: string[]`, not a
 * DB-enforced enum.
 */
export const EXCLUSION_OPTIONS: string[] = [
  "Airfare / Flights",
  "Personal Expenses",
  "Tips & Gratuities",
  "Alcoholic Beverages",
  "Laundry Services",
  "Optional / Off-itinerary Activities",
  "Visa Fees",
  "Medical & Travel Insurance",
  "Excess Baggage Charges",
  "Anything Not Mentioned in Inclusions",
]
