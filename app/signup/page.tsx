"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [firstName, setFirstName] = useState("");

    async function handleSignup() {
        if (!firstName) {
            setMessage("Please enter your first name.");
            return;
        }
        if (!email) {
            setMessage("Please enter your email.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setMessage("Please enter your password.");
            return;
        }
        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                }
            }
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Account created! Redirecting...");
            setTimeout(() => {
                window.location.href = "/connect-bank";
            }, 2000);
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
            }}>Create account</h1>

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
                onBlur={() => {
                    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        setMessage("Please enter a valid email address.");
                    } else {
                        setMessage("");
                    }
                }}
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
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                onClick={handleSignup}
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
                Sign Up
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
                Already have an account?{" "}
                <a href="/login" style={{ color: "#00DF82", textDecoration: "none" }}>Log in</a>
            </p>
        </main>
    );
}