"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface KycGateProps {
  children: React.ReactNode;
}

export default function KycGate({ children }: KycGateProps) {
  const router = useRouter();
  const { isLoggedIn, kycData } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Allow access if KYC is submitted (PENDING, APPROVED)
  // Only block if NOT_STARTED or IN_PROGRESS
  if (kycData.status === "APPROVED" || kycData.status === "PENDING") {
    return <>{children}</>;
  }

  // Show rejection message
  if (kycData.status === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              KYC Verification Failed
            </h2>
            
            <p className="text-muted-foreground mb-4">
              {kycData.rejectionReason || "Your KYC verification was not successful."}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                Please review your documents and resubmit for verification.
              </p>
            </div>

            <Button
              onClick={() => router.push("/kyc")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Resubmit KYC
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show KYC required (NOT_STARTED or IN_PROGRESS)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-charcoal mb-2">
            KYC Required
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Complete KYC verification to access financial features
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why KYC is required:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Comply with RBI regulations</li>
                  <li>Secure your account</li>
                  <li>Access personalized recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push("/kyc")}
            className="w-full bg-primary hover:bg-primary/90 h-11"
          >
            Complete KYC Verification
          </Button>
        </div>
      </div>
    </div>
  );
}