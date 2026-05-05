"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const consentId = searchParams.get("id");
    const success = searchParams.get("success");

    if (success === "true" && consentId) {
      handleSuccess(consentId);
    } else {
      setStatus("failed");
    }
  }, []);

  async function handleSuccess(consentId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      // Store Consent ID
      await supabase
        .from("consents")
        .upsert({
          user_id: session.user.id,
          consent_id: consentId,
          status: "ACTIVE",
          created_at: new Date().toISOString(),
        });
      // Fetch data from Setu
      const response = await fetch("/api/setu/fetch-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentId,
          from: localStorage.getItem("consentDateFrom"),
          to: localStorage.getItem("consentDateTo"),
        }),
      });

      const result = await response.json();
      console.log("Fetch result:", result);

      setStatus("success");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (error) {
      console.error("Callback error:", error);
      setStatus("failed");
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
      alignItems: "center",
      padding: "32px 24px",
      textAlign: "center",
    }}>

      {status === "processing" && (
        <>
          <div style={{
            width: "48px",
            height: "48px",
            border: "3px solid #03624C",
            borderTop: "3px solid #00DF82",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "24px",
          }} />
          <h1 style={{ color: "#00DF82", fontSize: "22px", margin: "0 0 8px" }}>
            Connecting your bank...
          </h1>
          <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
            Just a moment
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎉</div>
          <h1 style={{ color: "#00DF82", fontSize: "22px", margin: "0 0 8px" }}>
            Bank connected!
          </h1>
          <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
            Taking you to your money leaks...
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>😔</div>
          <h1 style={{ color: "#FF6B6B", fontSize: "22px", margin: "0 0 8px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#888888", fontSize: "14px", margin: "0 0 24px" }}>
            We couldn't connect your bank. Please try again.
          </p>
          <button
            onClick={() => window.location.href = "/connect-bank"}
            style={{
              background: "#00DF82",
              color: "#030F0F",
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Try again
          </button>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

export default function SetuCallback() {
  return (
    <Suspense fallback={
      <main style={{
        background: "#030F0F",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <p style={{ color: "#00DF82" }}>Loading...</p>
      </main>
    }>
      <CallbackContent />
    </Suspense>
  );
}