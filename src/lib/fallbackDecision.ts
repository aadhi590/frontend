// src/lib/fallbackDecision.ts

export type FallbackDecision = {
  decision: "ALLOW" | "ALLOW_WITH_WARNING" | "REVIEW";
  riskScore: number;
  fallbackUsed: boolean;
  reasons: string[];
};

export function fallbackDecisionEngine(
  ctx: any,
  history: { avgAmount: number; lastSafeLocation?: string },
): FallbackDecision {
  let risk = 0;
  let reasons: string[] = [];
  let fallbackUsed = false;

  if (!ctx.location) {
    risk += 15;
    fallbackUsed = true;
    reasons.push("Location unavailable — using last known safe pattern");
  }

  if (!ctx.merchant) {
    risk += 10;
    fallbackUsed = true;
    reasons.push("Merchant data missing — inferred from past behavior");
  }

  if (ctx.amount > history.avgAmount * 2) {
    risk += 20;
    reasons.push("Amount significantly higher than historical average");
  }

  let decision: FallbackDecision["decision"] = "ALLOW";

  if (risk >= 30 && risk < 60) decision = "ALLOW_WITH_WARNING";
  if (risk >= 60) decision = "REVIEW";

  return {
    decision,
    riskScore: risk,
    fallbackUsed,
    reasons,
  };
}
