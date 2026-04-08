import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, image } = body;

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check email uniqueness if changed
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: session.user.id } },
      });
      if (existing) {
        return NextResponse.json({ error: "This email is already in use" }, { status: 409 });
      }
    }

    // Validate image size if provided (base64 data URLs can be large)
    if (image && image.length > 500_000) {
      return NextResponse.json({ error: "Image is too large. Please use an image under 500KB." }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim() || null;
    if (email !== undefined) updateData.email = email.trim() || null;
    if (image !== undefined) updateData.image = image || null;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        phoneVerified: true,
        image: true,
        referralCode: true,
        walletBalance: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
