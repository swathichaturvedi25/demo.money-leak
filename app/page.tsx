"use client";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { seedTransactions } from "./lib/seedTransactions";
import { summariseByCategory, calculateMonthlyLeak } from "./lib/classify";
export default function Home() {
  const [saved, setSaved] = useState(0);
  const [showRandomApp, setShowRandomApp] = useState(true);
  const [showNetflix, setShowNetflix] = useState(true);
  const [showAddBox, setShowAddBox] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState<
    { name: string; amount: number }[]
  >([]);
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyLeak, setMonthlyLeak] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
      } else {
        setUser(session.user);
        fetchTransactions(session.user.id);
      }
    });
    const handleFocus = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) fetchTransactions(session.user.id);
      });
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);

  }, []);
  async function fetchTransactions(userId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }
    // Deduplicate by merchant — keep only the latest entry per merchant
    const seen = new Set();
    const deduplicated = (data || []).filter(tx => {
      if (seen.has(tx.merchant.toLowerCase())) return false;
      seen.add(tx.merchant.toLowerCase());
      return true;
    });

    setTransactions(deduplicated);
    const leak = calculateMonthlyLeak(data || []);
    setMonthlyLeak(leak);
  }
  async function handleSeed() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const success = await seedTransactions(session.user.id);
    if (success) alert("Transactions seeded! Refresh to see them.");
  }
  return (
    <main
      style={{
        padding: "20px",
        background: "#030F0F",
        minHeight: "100vh",
        color: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#00DF82",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <button
          style={{
            background: "#0a1a12",
            border: "1px solid #00DF82",
            color: "#00DF82",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ₹
        </button>

        <button
          onClick={() => setShowAddBox(true)}
          style={{
            background: "#00DF82",
            border: "none",
            color: "#000",
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#00DF82", margin: "0 0 4px" }}>
          Money Leak
        </h1>
        <p style={{ color: "#aaa" }}>Hi {user?.user_metadata?.first_name || user?.email?.split("@")[0]}! 👋</p>
      </div>
      {showAddBox && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#0a1a12",
            borderRadius: "10px",
            border: "1px solid #00DF82",
          }}
        >
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Add Expense
          </p>

          <input
            placeholder="Expense name"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "none",
            }}
          />

          <input
            placeholder="Amount (₹)"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "none",
            }}
          />

          <button
            onClick={() => {
              if (!expenseName || !expenseAmount) return;

              setExpenses([
                ...expenses,
                {
                  name: expenseName,
                  amount: Number(expenseAmount),
                },
              ]);

              setExpenseName("");
              setExpenseAmount("");
              setShowAddBox(false);
            }}
            style={{
              background: "#00DF82",
              color: "#000",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              width: "100%",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      )}

      <p style={{ marginTop: "8px", color: "#aaa" }}>
        Track and cut useless spending
      </p>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#0a1a12",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          border: "1px solid #FF6B6B",
          borderRadius: "12px",
          color: "#FF6B6B",
          transition: "all 0.3s ease",
        }}
      >
        <h2 style={{ fontSize: "22px" }}>
          ⚠️ You're leaking ₹{monthlyLeak - saved}/month
        </h2>

        <p style={{ marginTop: "10px", color: "#aaa" }}>
          ₹{(monthlyLeak - saved) * 12}/year
        </p>
      </div>
      {
        saved > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#00DF82",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "#000",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
          >
            ✅ You saved ₹{saved}/month
            <br />
            That’s ₹{saved * 12}/year

            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              {saved * 12 > 20000
                ? "💻 That’s almost a new laptop!"
                : saved * 12 > 10000
                  ? "📱 That’s a new phone fund!"
                  : "✈️ That’s a weekend trip!"}
            </p>
          </div>
        )
      }
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "10px" }}>Subscriptions</h3>
        {!showNetflix && !showRandomApp && expenses.length === 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#00DF82",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "#000",
              borderRadius: "12px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            🎉 No more leaks!
            <br />
            You’re in control now 💪
          </div>
        )}
        {expenses.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#0a1a12",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
              marginBottom: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <p style={{ fontWeight: "600" }}>{item.name}</p>
            <p style={{ color: "#aaa" }}>₹{item.amount}/month • Manual</p>

            <button
              onClick={() => {
                setSaved((prev) => prev + item.amount);

                const updated = expenses.filter((_, i) => i !== index);
                setExpenses(updated);
              }}
              style={{
                marginTop: "10px",
                background: "#00DF82",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#000",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ✂️ Stop ₹{item.amount}
            </button>
          </div>
        ))}

        {transactions
          .filter(tx => tx.category === "subscription")
          .map((tx, index) => (
            <div
              key={index}
              style={{
                background: "#0a1a12",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <p style={{ fontWeight: "600" }}>{tx.merchant}</p>
              <p style={{ color: "#aaa" }}>₹{tx.amount}/month</p>
              <button
                onClick={() => {
                  setSaved(prev => prev + tx.amount);
                  setTransactions(prev => prev.filter(t => t.id !== tx.id));
                }}
                style={{
                  marginTop: "10px",
                  background: "#00DF82",
                  color: "#000",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✂️ Stop ₹{tx.amount}
              </button>
            </div>
          ))
        }
      </div>
      <button
        onClick={handleSeed}
        style={{
          background: "transparent",
          border: "1px solid #03624C",
          color: "#03624C",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
          marginTop: "20px",
          display: "block",
          width: "100%",
        }}
      >
        Seed test transactions
      </button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "#888888",
          padding: "4px 0",
          cursor: "pointer",
          fontSize: "12px",
          marginTop: "40px",
          textDecoration: "underline",
          display: "block",
          width: "100%",
          textAlign: "center",
        }}
      >
        Log Out
      </button>
    </main >
  );
}