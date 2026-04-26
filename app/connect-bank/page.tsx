"use client";
import { useState } from "react";

export default function ConnectBank() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConnect() {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/setu/create-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      background: "#030F0F",
      minHeight: "100vh",
      color: "#FFFFFF",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "32px 24px",
      maxWidth: "420px",
      margin: "0 auto",
    }}>

      <h1 style={{
        fontSize: "28px",
        fontWeight: "600",
        color: "#00DF82",
        margin: "0 0 8px",
      }}>Connect your bank</h1>

      <p style={{
        fontSize: "14px",
        color: "#888888",
        margin: "0 0 32px",
        lineHeight: "1.6",
      }}>
        Enter the mobile number linked to your bank account. We'll show you exactly where your money is going.
      </p>

      <p style={{
        fontSize: "11px",
        color: "#888888",
        margin: "0 0 8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>Mobile number</p>

      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#0a1a12",
        border: "1px solid #03624C",
        borderRadius: "10px",
        marginBottom: "24px",
        overflow: "hidden",
      }}>
        <span style={{
          padding: "14px 16px",
          color: "#888888",
          fontSize: "15px",
          borderRight: "1px solid #03624C",
        }}>+91</span>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          style={{
            flex: 1,
            padding: "14px 16px",
            background: "transparent",
            border: "none",
            color: "#FFFFFF",
            fontSize: "15px",
            outline: "none",
          }}
        />
      </div>

      <button
        onClick={handleConnect}
        disabled={loading}
        style={{
          background: loading ? "#03624C" : "#00DF82",
          color: "#030F0F",
          padding: "14px",
          border: "none",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
          width: "100%",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Connecting..." : "See my money leaks →"}
      </button>

      {error && (
        <p style={{
          marginTop: "16px",
          fontSize: "13px",
          color: "#FF6B6B",
          textAlign: "center",
        }}>{error}</p>
      )}

      <div style={{
        marginTop: "32px",
        padding: "16px",
        background: "#0a1a12",
        borderRadius: "10px",
        border: "1px solid #03624C",
      }}>
        <p style={{ fontSize: "12px", color: "#888888", margin: "0", lineHeight: "1.6" }}>
          🔒 Read-only access only. We can never move your money. Powered by RBI's Account Aggregator framework.
        </p>
      </div>

    </main>
  );
}