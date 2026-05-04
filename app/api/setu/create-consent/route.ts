import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { mobile } = await request.json();
        console.log("Using credentials:", {
            clientId: process.env.SETU_CLIENT_ID,
            hasSecret: !!process.env.SETU_CLIENT_SECRET,
            productId: process.env.SETU_PRODUCT_ID,
        });

        const consentResponse = await fetch(
            "https://fiu-sandbox.setu.co/v2/consents",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-client_id": process.env.SETU_CLIENT_ID!,
                    "x-client-secret": process.env.SETU_CLIENT_SECRET!,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
                body: JSON.stringify({
                    consentDuration: {
                        unit: "YEAR",
                        value: 1,
                    },
                    frequency: {
                        unit: "MONTH",
                        value: 45,
                    },
                    dataRange: {
                        from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
                        to: new Date().toISOString(),
                    },
                    vua: mobile,
                    fiTypes: ["DEPOSIT"],
                    redirectUrl: "https://localhost:3000/setu-callback"
                }),
            }
        );

        const consentData = await consentResponse.json();

        if (consentData.url) {
            return NextResponse.json({ redirectUrl: consentData.url });
        } else {
            console.error("Setu consent error:", consentData);
            return NextResponse.json(
                { error: "Failed to create consent" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}