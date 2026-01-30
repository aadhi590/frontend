"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useRef } from "react";
import {
  Loader2,
  Shield,
  CheckCircle2,
  Upload,
  X,
  FileText,
  Camera,
  AlertCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

export default function KycPage() {
  const router = useRouter();
  const updateKyc = useAuthStore((state) => state.updateKyc);
  const submitKyc = useAuthStore((state) => state.submitKyc);
  const kycData = useAuthStore((state) => state.kycData);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    aadhaarNumber: kycData.aadhaarNumber || "",
    panNumber: kycData.panNumber || "",
    dob: kycData.dob || "",
    address: kycData.address || "",
    city: kycData.city || "",
    state: kycData.state || "",
    pincode: kycData.pincode || "",
  });

  const [documents, setDocuments] = useState({
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    panCard: null as File | null,
    selfie: null as File | null,
  });

  const [previews, setPreviews] = useState({
    aadhaarFront: kycData.aadhaarFront || "",
    aadhaarBack: kycData.aadhaarBack || "",
    panCard: kycData.panCard || "",
    selfie: kycData.selfie || "",
  });

  const aadhaarFrontRef = useRef<HTMLInputElement>(null);
  const aadhaarBackRef = useRef<HTMLInputElement>(null);
  const panCardRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    type: keyof typeof documents,
    file: File | null
  ) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setDocuments({ ...documents, [type]: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews({ ...previews, [type]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (type: keyof typeof documents) => {
    setDocuments({ ...documents, [type]: null });
    setPreviews({ ...previews, [type]: "" });
  };

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar.replace(/\s/g, ""));
  };

  const validatePAN = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  };

  const validatePincode = (pincode: string) => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  };

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!validateAadhaar(formData.aadhaarNumber)) {
        setError("Please enter a valid 12-digit Aadhaar number");
        return;
      }
      if (!validatePAN(formData.panNumber)) {
        setError("Please enter a valid PAN number (e.g., ABCDE1234F)");
        return;
      }
      if (!formData.dob) {
        setError("Please enter your date of birth");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.address.trim()) {
        setError("Please enter your address");
        return;
      }
      if (!formData.city.trim()) {
        setError("Please enter your city");
        return;
      }
      if (!formData.state) {
        setError("Please select your state");
        return;
      }
      if (!validatePincode(formData.pincode)) {
        setError("Please enter a valid 6-digit pincode");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!previews.aadhaarFront || !previews.aadhaarBack) {
      setError("Please upload both sides of your Aadhaar card");
      return;
    }

    if (!previews.panCard) {
      setError("Please upload your PAN card");
      return;
    }

    if (!previews.selfie) {
      setError("Please upload a selfie for verification");
      return;
    }

    setLoading(true);

    // Save to store
    updateKyc({
      ...formData,
      aadhaarFront: previews.aadhaarFront,
      aadhaarBack: previews.aadhaarBack,
      panCard: previews.panCard,
      selfie: previews.selfie,
    });

    const result = await submitKyc();

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "KYC submission failed");
    }

    setLoading(false);
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Secure KYC Verification</span>
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Complete Your KYC</h1>
          <p className="text-muted-foreground">
            We need to verify your identity to comply with RBI regulations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      step >= num
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <span className="text-xs mt-2 font-medium text-center">
                    {num === 1 && "Identity"}
                    {num === 2 && "Address"}
                    {num === 3 && "Documents"}
                  </span>
                </div>
                {num < 3 && (
                  <div className="flex-1 px-2">
                    <div
                      className={`h-1 rounded transition-all duration-300 ${
                        step > num ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Identity Details */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-1">
                    Identity Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your government-issued ID details
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="text-sm font-medium">
                    Aadhaar Number *
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaarNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "").slice(0, 12);
                      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setFormData({ ...formData, aadhaarNumber: formatted });
                    }}
                    className="h-11 font-mono"
                    maxLength={14}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Your Aadhaar number is encrypted and stored securely
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-sm font-medium">
                    PAN Number *
                  </Label>
                  <Input
                    id="pan"
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        panNumber: e.target.value.toUpperCase(),
                      })
                    }
                    className="h-11 font-mono uppercase"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="h-11"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-1">
                    Address Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Provide your current residential address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="House/Flat No., Street Name"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="h-11"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="6-digit code"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        })
                      }
                      className="h-11 font-mono"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State *
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-1">
                    Upload Documents
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please upload clear photos of your documents
                  </p>
                </div>

                {/* Aadhaar Front */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Aadhaar Card - Front *</Label>
                  <input
                    ref={aadhaarFrontRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange("aadhaarFront", e.target.files?.[0] || null)
                    }
                  />
                  {!previews.aadhaarFront ? (
                    <button
                      type="button"
                      onClick={() => aadhaarFrontRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                    >
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Click to upload Aadhaar front
                      </span>
                    </button>
                  ) : (
                    <div className="relative group">
                      <img
                        src={previews.aadhaarFront}
                        alt="Aadhaar Front"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument("aadhaarFront")}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Aadhaar Back */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Aadhaar Card - Back *</Label>
                  <input
                    ref={aadhaarBackRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange("aadhaarBack", e.target.files?.[0] || null)
                    }
                  />
                  {!previews.aadhaarBack ? (
                    <button
                      type="button"
                      onClick={() => aadhaarBackRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                    >
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Click to upload Aadhaar back
                      </span>
                    </button>
                  ) : (
                    <div className="relative group">
                      <img
                        src={previews.aadhaarBack}
                        alt="Aadhaar Back"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument("aadhaarBack")}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* PAN Card */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">PAN Card *</Label>
                  <input
                    ref={panCardRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange("panCard", e.target.files?.[0] || null)
                    }
                  />
                  {!previews.panCard ? (
                    <button
                      type="button"
                      onClick={() => panCardRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                    >
                      <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Click to upload PAN card
                      </span>
                    </button>
                  ) : (
                    <div className="relative group">
                      <img
                        src={previews.panCard}
                        alt="PAN Card"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument("panCard")}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Selfie */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Live Selfie *</Label>
                  <input
                    ref={selfieRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange("selfie", e.target.files?.[0] || null)
                    }
                  />
                  {!previews.selfie ? (
                    <button
                      type="button"
                      onClick={() => selfieRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                    >
                      <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Click to take/upload selfie
                      </span>
                    </button>
                  ) : (
                    <div className="relative group">
                      <img
                        src={previews.selfie}
                        alt="Selfie"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument("selfie")}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Document Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Images should be clear and all text should be readable</li>
                      <li>Maximum file size: 5MB per document</li>
                      <li>Accepted formats: JPG, PNG, HEIC</li>
                      <li>Ensure your face is clearly visible in the selfie</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => {
                    setError("");
                    setStep(step - 1);
                  }}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 font-medium"
                  onClick={handleNext}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Verification
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your information is encrypted and stored securely. We comply with RBI guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}