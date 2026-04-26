import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { mobile } = await request.json();

        // Step 1 — Get access token from Setu
        const tokenResponse = await fetch(
            "https://orgservice-prod.setu.co/v1/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "client": "bridge",
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
                body: JSON.stringify({
                    clientID: process.env.SETU_CLIENT_ID,
                    grant_type: "client_credentials",
                    secret: process.env.SETU_CLIENT_SECRET,
                }),
            }
        );

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log("Token response:", JSON.stringify(tokenData));

        if (!accessToken) {
            return NextResponse.json(
                { error: "Failed to get access token" },
                { status: 500 }
            );
        }

        // Step 2 — Create consent request
        const consentResponse = await fetch(
            "https://fiu-sandbox.setu.co/api/v2/consents",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "x-product-instance-id": process.env.SETU_PRODUCT_ID!,
                },
                body: JSON.stringify({
                    ver: "2.0.0",
                    timestamp: new Date().toISOString(),
                    txnid: crypto.randomUUID(),
                    ConsentDetail: {
                        consentStart: new Date().toISOString(),
                        consentExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                        consentMode: "STORE",
                        fetchType: "PERIODIC",
                        consentTypes: ["PROFILE", "SUMMARY", "TRANSACTIONS"],
                        fiTypes: ["DEPOSIT"],
                        DataConsumer: {
                            id: process.env.SETU_PRODUCT_ID,
                            type: "FIU"
                        },
                        Customer: {
                            id: `${mobile}@setu`
                        },
                        Purpose: {
                            code: "102",
                            refUri: "https://api.rebit.org.in/aa/purpose/102.xml",
                            text: "Customer spending and budget analysis",
                            Category: { type: "string" }
                        },
                        FIDataRange: {
                            from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
                            to: new Date().toISOString()
                        },
                        DataLife: { unit: "MONTH", value: 12 },
                        Frequency: { unit: "HOUR", value: 1 }
                    }
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