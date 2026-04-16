"use client";
import { useState } from "react";
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
  return (
    <main
      style={{
        padding: "20px",
        background: "#0B0B0B",
        minHeight: "100vh",
        color: "#00FF94",
        fontFamily: "sans-serif",
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
            color: "#00FF94",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <button
          style={{
            background: "#1A1A1A",
            border: "1px solid #00FF94",
            color: "#00FF94",
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
            background: "#00FF94",
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
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          Money Leak
        </h1>
        <p style={{ color: "#aaa" }}>Hi, Tanushri S 👋</p>
      </div>
      {showAddBox && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#1A1A1A",
            borderRadius: "10px",
            border: "1px solid #00FF94",
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
              background: "#00FF94",
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
          background: "#2A0B0B",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          border: "1px solid #FF4D4D",
          borderRadius: "12px",
          color: "#FF4D4D",
          transition: "all 0.3s ease",
        }}
      >
        <h2 style={{ fontSize: "22px" }}>
          ⚠️ You’re leaking ₹{2067 - saved}/month
        </h2>

        <p style={{ marginTop: "10px", color: "#aaa" }}>
          ₹{(2067 - saved) * 12}/year
        </p>
      </div>
      {
        saved > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#00FF94",
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
              background: "#00FF94",
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
              background: "#1A1A1A",
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
                background: "#00FF94",
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

        {showNetflix && (
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <p style={{ fontWeight: "600" }}>Netflix</p>
            <p style={{ color: "#aaa" }}>₹649/month • Used recently</p>

            <button
              onClick={() => {
                setSaved((prev) => prev + 649);
                setShowNetflix(false);
              }}
              style={{
                marginTop: "10px",
                background: "#00FF94",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#000",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✂️ Stop ₹649
            </button>
          </div>
        )}

        {showRandomApp && (
          <div
            style={{
              background: "#1A1A1A",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
              marginBottom: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <p style={{ fontWeight: "600" }}>Random App</p>
            <p style={{ color: "#FF4D4D" }}>₹299/month • Not used in 90 days</p>

            <button
              onClick={() => {
                setSaved(saved + 299);
                setShowRandomApp(false);
              }}
              style={{
                marginTop: "10px",
                background: "#00FF94",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#000",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✂️ Stop ₹299
            </button>
          </div>
        )}
      </div>
    </main >
  );
}