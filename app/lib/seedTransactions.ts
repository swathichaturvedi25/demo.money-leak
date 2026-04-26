import { supabase } from "./supabase";
import { classifyTransaction } from "./classify";

const dummyTransactions = [
  { merchant: "Netflix", amount: 649, date: "2026-04-01" },
  { merchant: "Spotify", amount: 119, date: "2026-04-01" },
  { merchant: "Hotstar", amount: 299, date: "2026-04-02" },
  { merchant: "Swiggy", amount: 450, date: "2026-04-03" },
  { merchant: "Zomato", amount: 380, date: "2026-04-05" },
  { merchant: "Swiggy", amount: 520, date: "2026-04-08" },
  { merchant: "HPCL Petrol", amount: 2000, date: "2026-04-10" },
  { merchant: "Starbucks", amount: 620, date: "2026-04-11" },
  { merchant: "Third Wave Coffee", amount: 380, date: "2026-04-14" },
  { merchant: "Amazon", amount: 1299, date: "2026-04-15" },
  { merchant: "Netflix", amount: 649, date: "2026-03-01" },
  { merchant: "Spotify", amount: 119, date: "2026-03-01" },
  { merchant: "Uber", amount: 250, date: "2026-04-16" },
  { merchant: "Namma Yatri", amount: 180, date: "2026-04-17" },
  { merchant: "Airtel", amount: 599, date: "2026-04-05" },
  { merchant: "Google One", amount: 130, date: "2026-04-01" },
  { merchant: "Zomato", amount: 290, date: "2026-04-18" },
  { merchant: "BPCL Petrol", amount: 1500, date: "2026-04-19" },
  { merchant: "Myntra", amount: 1899, date: "2026-04-20" },
  { merchant: "Canva", amount: 499, date: "2026-04-01" },
];

export async function seedTransactions(userId: string) {
  const classified = dummyTransactions.map(tx => ({
    user_id: userId,
    merchant: tx.merchant,
    amount: tx.amount,
    date: tx.date,
    category: classifyTransaction(tx.merchant),
  }));

  const { error } = await supabase
    .from("transactions")
    .insert(classified);

  if (error) {
    console.error("Seed error:", error.message);
    return false;
  }

  return true;
}