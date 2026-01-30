"use client";

import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";

export default function KycDemoControls() {
  const { kycData, updateKyc } = useAuthStore();

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 z-50 max-w-xs">
      <div className="mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Demo Controls</p>
        <p className="text-sm font-semibold text-charcoal">
          Current Status: <span className="text-primary">{kycData.status}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => updateKyc({ status: "PENDING", submittedAt: new Date().toISOString() })}
          className="w-full text-xs h-8 bg-amber-600 hover:bg-amber-700"
          size="sm"
        >
          <Clock className="w-3 h-3 mr-1" />
          Set to Pending
        </Button>

        <Button
          onClick={() => updateKyc({ status: "APPROVED" })}
          className="w-full text-xs h-8 bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approve KYC
        </Button>

        <Button
          onClick={() => updateKyc({ 
            status: "REJECTED", 
            rejectionReason: "Documents are not clear. Please upload clearer images." 
          })}
          className="w-full text-xs h-8 bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Reject KYC
        </Button>

        <Button
          onClick={() => updateKyc({ status: "NOT_STARTED" })}
          variant="outline"
          className="w-full text-xs h-8"
          size="sm"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset to Not Started
        </Button>
      </div>

      <p className="text-[10px] text-gray-500 mt-3 text-center">
        Development only - won't show in production
      </p>
    </div>
  );
}