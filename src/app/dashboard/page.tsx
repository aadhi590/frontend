"use client";

import BankSaathiApp from "@/components/BankSaathiApp";
import KycGate from "@/components/KycGate";
import KycStatusBanner from "@/components/KycStatusBanner";

export default function Dashboard() {
  return (
    <KycGate>
      <main>
        <KycStatusBanner />
        <BankSaathiApp />
      </main>
    </KycGate>
  );
}