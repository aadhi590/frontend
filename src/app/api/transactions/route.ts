import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/security/jwt";
import { riskScorer } from "@/lib/decision-engine/risk-scorer";
import { mockAuthService } from "@/lib/mock-auth-service";

const USE_MOCK_MODE =
  process.env.NEXT_PUBLIC_USE_MOCK_MODE === "true" || !process.env.DATABASE_URL;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    console.log(
      `📊 Fetching transactions for user ${decoded.userId} (mock mode: ${USE_MOCK_MODE})`,
    );

    // Use mock service for all requests
    const userTransactions = await mockAuthService.getTransactions(
      decoded.userId,
      limit,
      offset,
    );

    return NextResponse.json({
      success: true,
      data: {
        transactions: userTransactions,
        pagination: {
          limit,
          offset,
          total: userTransactions.length,
        },
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      amount,
      recipientId,
      recipientName,
      merchantName,
      merchantCategory,
      location,
    } = body;

    // Validation
    if (!amount || !recipientId) {
      return NextResponse.json(
        { success: false, error: "Amount and recipient are required" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    // Get user history
    const userHistory = await mockAuthService.getUserHistory(decoded.userId);

    // Perform risk assessment
    const riskAssessment = riskScorer.assessRisk(
      {
        amount,
        recipientId,
        merchantName,
        merchantCategory,
        location,
        time: new Date().toISOString(),
      },
      userHistory,
    );

    console.log(
      `💳 Creating transaction for user ${decoded.userId} - Amount: ₹${amount}`,
    );

    const newTransaction = await mockAuthService.createTransaction(
      decoded.userId,
      {
        amount: amount.toString(),
        recipientId,
        recipientName,
        merchantName,
        merchantCategory,
        location,
        decision: riskAssessment.decision,
        riskScore: riskAssessment.riskScore,
        fallbackUsed: riskAssessment.fallbackUsed,
      },
    );

    console.log(
      `✅ Transaction created: ${newTransaction.id} - Decision: ${riskAssessment.decision}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          transaction: newTransaction,
          riskAssessment: {
            decision: riskAssessment.decision,
            riskScore: riskAssessment.riskScore,
            confidenceScore: riskAssessment.confidenceScore,
            reasons: riskAssessment.reasons,
            recommendations: riskAssessment.recommendations,
            fallbackUsed: riskAssessment.fallbackUsed,
            riskFactors: riskAssessment.riskFactors,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
