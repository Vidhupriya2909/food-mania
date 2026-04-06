"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Lock, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`admin-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        phone,
        otp: otpValue,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid OTP or unauthorized access.");
      } else {
        // Verify the logged-in user is actually an admin
        const verifyRes = await fetch("/api/auth/verify-admin");
        const verifyData = await verifyRes.json();

        if (!verifyData.isAdmin) {
          setError("Access denied. This login is restricted to administrators only.");
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      }
    } catch (err: any) {
      setError("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" id="admin-login-page">
      {/* Dark admin background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.08),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,146,60,0.05),transparent_50%)] -z-10" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-8">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500/20 to-spice-500/20 border border-saffron-500/30 mb-4">
                <ShieldCheck className="w-8 h-8 text-saffron-400" />
              </div>
              <h1 className="text-2xl font-bold font-heading text-white">
                {step === "phone" ? "Admin Portal" : "Verify Identity"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {success
                  ? "Access granted. Redirecting..."
                  : step === "phone"
                  ? "Restricted access — Authorized personnel only"
                  : `Enter the 6-digit code sent to +91 ${phone}`}
              </p>
              {success && (
                <div className="mt-3 flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Access Granted
                </div>
              )}
            </div>

            {/* Phone Step */}
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="admin-phone" className="text-sm text-slate-300">
                    Admin Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-md border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-400">
                      +91
                    </div>
                    <Input
                      id="admin-phone"
                      type="tel"
                      placeholder="Enter admin phone number"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-saffron-500/50"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full gap-2"
                  size="lg"
                  disabled={phone.length < 10 || isLoading}
                  id="admin-send-otp-btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Authenticate
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-4 justify-center">
                  <KeyRound className="w-3 h-3" />
                  Protected by multi-factor authentication
                </div>
              </form>
            ) : (
              /* OTP Step */
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* Dev mode hint */}
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-center">
                  <p className="text-xs text-amber-400 font-medium">
                    🔧 Dev Mode: Use OTP{" "}
                    <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                      123456
                    </code>
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-sm text-slate-300">Enter 6-digit OTP</Label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`admin-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full gap-2"
                  size="lg"
                  disabled={otp.join("").length !== 6 || isLoading}
                  id="admin-verify-otp-btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Enter
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-400">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-saffron-400 font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    ← Change number
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-[10px] text-slate-600 text-center mt-4">
          Food Mart Administration Console v1.0
        </p>
      </div>
    </div>
  );
}
