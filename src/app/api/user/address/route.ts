import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Check if it's the first address to make it default automatically
    const existingCount = await prisma.address.count({
      where: { userId: session.user.id }
    });

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || "",
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isDefault: existingCount === 0
      }
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
