import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Rate limiting: check recent OTP requests for this phone
    const recentOtpCount = await prisma.otpVerification.count({
      where: {
        phone,
        createdAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        }
      }
    });

    if (recentOtpCount >= 5) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save to DB
    await prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    // In production, integrate with MSG91 or Twilio
    // Wait for the environment variable, but for now log it
    console.log(`[DEV ONLY] Resend/Send OTP for +91${phone} is: ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
