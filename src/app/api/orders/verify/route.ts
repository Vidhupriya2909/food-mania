import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      our_order_id
    } = body;

    // Verify the order belongs to this user
    const existingOrder = await prisma.order.findUnique({
      where: { id: our_order_id },
      select: { userId: true },
    });

    if (!existingOrder || existingOrder.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Simulated Verification (if no Razorpay keys are configured)
    if (!secret || secret === "") {
      const order = await prisma.order.update({
        where: { id: our_order_id },
        data: { status: "CONFIRMED" }
      });
      return NextResponse.json({ success: true, message: "Simulated verification successful", order });
    }

    // Actual Razorpay Signature verification
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: our_order_id },
      data: { status: "CONFIRMED" }
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: order.userId,
        orderId: our_order_id,
        amount: order.finalAmount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS"
      }
    });

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}
