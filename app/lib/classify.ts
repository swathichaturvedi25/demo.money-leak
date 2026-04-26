// Classification Engine — Rule-based transaction tagger

type Category = "subscription" | "food" | "fuel" | "coffee" | "shopping" | "transport" | "utilities" | "other";

interface Transaction {
  merchant: string;
  amount: number;
  date: string;
}

interface ClassifiedTransaction extends Transaction {
  category: Category;
  isRecurring: boolean;
}

// Keyword rules — order matters, more specific first
const rules: { keywords: string[]; category: Category }[] = [
  {
    keywords: ["netflix", "spotify", "hotstar", "prime video", "apple music", "youtube premium", "zee5", "sonyliv", "jiocinema", "mxplayer", "curiosity stream", "linkedin premium", "notion", "figma", "github", "chatgpt", "openai", "canva", "dropbox", "google one", "icloud", "microsoft 365"],
    category: "subscription",
  },
  {
    keywords: ["swiggy", "zomato", "blinkit", "zepto", "bigbasket", "dunzo", "dominos", "pizza hut", "mcdonald", "kfc", "burger king", "subway", "wow momo", "behrouz", "box8", "freshmenu"],
    category: "food",
  },
  {
    keywords: ["hpcl", "bpcl", "indian oil", "iocl", "shell", "essar", "reliance petrol", "hp petrol", "bharat petrol", "petrol", "fuel"],
    category: "fuel",
  },
  {
    keywords: ["starbucks", "third wave", "blue tokai", "cafe coffee day", "ccd", "barista", "tim hortons", "la prima", "coffee"],
    category: "coffee",
  },
  {
    keywords: ["uber", "ola", "rapido", "namma yatri", "metro", "irctc", "makemytrip", "goibibo", "redbus"],
    category: "transport",
  },
  {
    keywords: ["amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho", "snapdeal", "tata cliq", "reliance digital", "croma", "vijay sales"],
    category: "shopping",
  },
  {
    keywords: ["electricity", "bescom", "tata power", "adani electricity", "water bill", "gas bill", "broadband", "airtel", "jio", "vodafone", "vi ", "bsnl", "act fibernet"],
    category: "utilities",
  },
];

export function classifyTransaction(merchant: string): Category {
  const lower = merchant.toLowerCase();
  
  for (const rule of rules) {
    if (rule.keywords.some(keyword => lower.includes(keyword))) {
      return rule.category;
    }
  }
  
  return "other";
}

export function classifyTransactions(transactions: Transaction[]): ClassifiedTransaction[] {
  return transactions.map(tx => ({
    ...tx,
    category: classifyTransaction(tx.merchant),
    isRecurring: detectRecurring(tx, transactions),
  }));
}

function detectRecurring(tx: Transaction, allTransactions: Transaction[]): boolean {
  // A transaction is recurring if the same merchant appears 2+ times
  const samemerchant = allTransactions.filter(
    t => t.merchant.toLowerCase() === tx.merchant.toLowerCase()
  );
  return samemerchant.length >= 2;
}

export function summariseByCategory(transactions: ClassifiedTransaction[]) {
  const summary: Record<string, { total: number; count: number; transactions: ClassifiedTransaction[] }> = {};

  for (const tx of transactions) {
    if (!summary[tx.category]) {
      summary[tx.category] = { total: 0, count: 0, transactions: [] };
    }
    summary[tx.category].total += tx.amount;
    summary[tx.category].count += 1;
    summary[tx.category].transactions.push(tx);
  }

  return summary;
}

export function calculateMonthlyLeak(transactions: ClassifiedTransaction[]): number {
  const leakCategories: Category[] = ["subscription", "coffee"];
  return transactions
    .filter(tx => leakCategories.includes(tx.category))
    .reduce((sum, tx) => sum + tx.amount, 0);
}