"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChefHat, ArrowRight, Smartphone, Shield } from "lucide-react";

const DEV_OTP = "123456";

export default function LoginPage() {
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

    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
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
        setError("Invalid OTP. Please try again.");
      } else {
        setSuccess(true);
        // Login successful, redirecting manually after showing success
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      setError("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 page-enter" id="login-page">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 via-background to-spice-50 dark:from-saffron-950/20 dark:via-background dark:to-spice-950/20 -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spice-400/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-none bg-background/80 backdrop-blur-xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-spice-500 flex items-center justify-center shadow-lg shadow-saffron-500/25">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
              </Link>
              <h1 className="text-2xl font-bold font-heading">
                {step === "phone" ? "Welcome to Food Mart" : "Verify OTP"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {success
                  ? "Login successful! Redirecting..."
                  : step === "phone"
                  ? "Sign in with your mobile number"
                  : `We sent a 6-digit code to +91 ${phone}`}
              </p>
              {success && (
                <div className="mt-2 text-3xl">🎉</div>
              )}
            </div>

            {/* Phone Step */}
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-md border bg-secondary/50 text-sm font-medium">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your 10-digit number"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="flex-1"
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
                  id="send-otp-btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Send OTP
                    </>
                  )}
                </Button>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="gap-2" 
                    id="google-login-btn"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="gap-2" 
                    id="apple-login-btn"
                    onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-4 justify-center">
                  <Shield className="w-3 h-3" />
                  Your data is safe & secure with us
                </div>
              </form>
            ) : (
              /* OTP Step */
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* Dev mode hint */}
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">🔧 Dev Mode: Use OTP <code className="bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-mono font-bold">123456</code></p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-sm">Enter 6-digit OTP</Label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 transition-all"
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
                  id="verify-otp-btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Login
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive the code?{" "}
                    <button type="button" onClick={handleSendOtp} disabled={isLoading} className="text-saffron-500 font-medium hover:underline">
                      Resend OTP
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Change number
                  </button>
                </div>
              </form>
            )}

            {/* Terms */}
            <p className="text-[10px] text-muted-foreground text-center mt-6 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
