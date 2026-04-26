"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/";
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
      }}>Welcome back</h1>

      <p style={{
        fontSize: "14px",
        color: "#888888",
        margin: "0 0 32px",
      }}>Your money is your power.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px 16px",
          marginBottom: "12px",
          background: "#0a1a12",
          border: "1px solid #03624C",
          color: "#FFFFFF",
          borderRadius: "10px",
          fontSize: "15px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px 16px",
          marginBottom: "24px",
          background: "#0a1a12",
          border: "1px solid #03624C",
          color: "#FFFFFF",
          borderRadius: "10px",
          fontSize: "15px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          background: "#00DF82",
          color: "#030F0F",
          padding: "14px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
          width: "100%",
        }}
      >
        Log In
      </button>

      {message && (
        <p style={{
          marginTop: "16px",
          fontSize: "13px",
          color: message.includes("created") ? "#00DF82" : "#FF6B6B",
          textAlign: "center",
        }}>{message}</p>
      )}

      <p style={{ marginTop: "24px", fontSize: "14px", color: "#888888", textAlign: "center" }}>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "#00DF82", textDecoration: "none" }}>Sign up</a>
      </p>
    </main>
  );
}