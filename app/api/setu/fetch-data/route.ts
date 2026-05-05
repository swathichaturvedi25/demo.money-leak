import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { consentId } = await request.json();
        const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const to = new Date().toISOString();
        console.log("Data session request:", { consentId, from, to });

        // Check consent details first
        const consentCheck = await fetch(
            `https://fiu-sandbox.setu.co/v2/consents/${consentId}?expanded=true`,
            {
                method: "GET",
                headers: {
                    "x-client_id": process.env.SETU_CLIENT_ID!,
                    "x-client-secret": process.env.SETU_CLIENT_SECRET!,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
            }
        );
        const consentDetails = await consentCheck.json();
        console.log("Consent details:", JSON.stringify(consentDetails));

        const fiDataRange = consentDetails.detail.dataRange;

        // Step 1 — Create a data session
        const sessionResponse = await fetch(
            `https://fiu-sandbox.setu.co/v2/sessions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-client_id": process.env.SETU_CLIENT_ID!,
                    "x-client-secret": process.env.SETU_CLIENT_SECRET!,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
                body: JSON.stringify({
                    consentId,
                    dataRange: {
                        from: fiDataRange.from,
                        to: fiDataRange.to,
                    },
                    format: "json",
                }),
            }
        );

        const sessionData = await sessionResponse.json();
        console.log("Session response:", JSON.stringify(sessionData));

        if (!sessionData.id) {
            return NextResponse.json(
                { error: "Failed to create data session", details: sessionData },
                { status: 500 }
            );
        }
        // Step 2 — Fetch the data using session ID
        const dataResponse = await fetch(
            `https://fiu-sandbox.setu.co/v2/sessions/${sessionData.id}`,
            {
                method: "GET",
                headers: {
                    "x-client_id": process.env.SETU_CLIENT_ID!,
                    "x-client-secret": process.env.SETU_CLIENT_SECRET!,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
            }
        );

        const fiData = await dataResponse.json();
        console.log("FI Data:", JSON.stringify(fiData));

        // Wait 3 seconds for data to be ready
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Fetch again
        const dataResponse2 = await fetch(
            `https://fiu-sandbox.setu.co/v2/sessions/${sessionData.id}`,
            {
                method: "GET",
                headers: {
                    "x-client_id": process.env.SETU_CLIENT_ID!,
                    "x-client-secret": process.env.SETU_CLIENT_SECRET!,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
            }
        );
        const fiData2 = await dataResponse2.json();
        console.log("FI Data after wait:", JSON.stringify(fiData2));
        return NextResponse.json({ success: true, data: fiData2 });

    } catch (error) {
        console.error("Data fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}