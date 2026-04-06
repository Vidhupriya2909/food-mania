import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Razorpay from "razorpay";

function generateOrderNumber() {
  const prefix = "FM";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}${timestamp}${random}`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, addressId, selectedSlots, cartTotal, tax, delivery, finalTotal } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Since Order model supports only ONE deliverySlotId, but we might have multiple meal types,
    // we'll just store the slots in notes as a JSON string for fulfillment reference.
    const slotMetadata = JSON.stringify(selectedSlots || {});

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: generateOrderNumber(),
        totalAmount: cartTotal,
        taxAmount: tax,
        deliveryCharge: delivery,
        finalAmount: finalTotal,
        addressId: addressId,
        notes: `Delivery Slots Info: ${slotMetadata}`,
        // We set status to PENDING until payment is verified
        status: "PENDING",
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            // MealType might be passed if we map the string to the Prisma enum
            mealType: item.mealType || "BREAKFAST",
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    let razorpayOrderId = null;
    let isMocked = true;

    // Check if Razorpay keys are configured
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      isMocked = false;
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const rzpOrder = await rzp.orders.create({
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: "INR",
        receipt: order.id,
      });
      razorpayOrderId = rzpOrder.id;
    }

    return NextResponse.json({ 
      success: true, 
      order, 
      razorpayOrderId, 
      isMocked 
    });
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
