"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { summariseByCategory, calculateMonthlyLeak } from "../lib/classify";
import { seedTransactions } from "../lib/seedTransactions";

export default function Insights() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [categorySummary, setCategorySummary] = useState<any>({});
    const [monthlyLeak, setMonthlyLeak] = useState(0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                window.location.href = "/login";
            } else {
                fetchTransactions(session.user.id);
            }
        });
    }, []);  // ← don't forget the closing [], );

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

        const results = data || [];
        setTransactions(results);
        setCategorySummary(summariseByCategory(results));
        setMonthlyLeak(calculateMonthlyLeak(results));
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
            <h2 style={{ fontSize: "22px", color: "#00DF82"}}>
                Your Monthly Insights
            </h2>
            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#0a1a12",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    border: "1px solid #FF6B6B",
                    color: "#FFFFFF",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                }}
            >
                <h3 style={{ fontSize: "22px" , color:  "#FF6B6B"}}>
                    ⚠️ You're leaking ₹{monthlyLeak} /month 
                </h3>
            </div>
        </main>
    );
}
