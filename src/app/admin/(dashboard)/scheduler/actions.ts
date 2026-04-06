"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") throw new Error("Forbidden");
}

export async function addToDailyMenu(formData: FormData) {
  await verifyAdmin();

  const menuItemId = formData.get("menuItemId") as string;
  const mealType = formData.get("mealType") as string;
  const dateStr = formData.get("date") as string;
  const specialPriceStr = formData.get("specialPrice") as string;

  if (!menuItemId || !mealType || !dateStr) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const specialPrice = specialPriceStr ? parseFloat(specialPriceStr) : undefined;

  // Check if already scheduled
  const existing = await prisma.dailyMenu.findUnique({
    where: {
      date_mealType_menuItemId: {
        date,
        mealType: mealType as any,
        menuItemId,
      },
    },
  });

  if (existing) {
    throw new Error("This item is already scheduled for this meal on this date");
  }

  // Get next sort order
  const lastItem = await prisma.dailyMenu.findFirst({
    where: { date, mealType: mealType as any },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.dailyMenu.create({
    data: {
      date,
      mealType: mealType as any,
      menuItemId,
      sortOrder: (lastItem?.sortOrder ?? -1) + 1,
      specialPrice: specialPrice || undefined,
      isAvailable: true,
    },
  });

  revalidatePath("/admin/scheduler");
  revalidatePath("/menu");
}

export async function removeFromDailyMenu(dailyMenuId: string) {
  await verifyAdmin();

  await prisma.dailyMenu.delete({
    where: { id: dailyMenuId },
  });

  revalidatePath("/admin/scheduler");
  revalidatePath("/menu");
}

export async function toggleAvailability(dailyMenuId: string, isAvailable: boolean) {
  await verifyAdmin();

  await prisma.dailyMenu.update({
    where: { id: dailyMenuId },
    data: { isAvailable },
  });

  revalidatePath("/admin/scheduler");
  revalidatePath("/menu");
}

export async function updateSpecialPrice(dailyMenuId: string, specialPrice: number | null) {
  await verifyAdmin();

  await prisma.dailyMenu.update({
    where: { id: dailyMenuId },
    data: { specialPrice },
  });

  revalidatePath("/admin/scheduler");
  revalidatePath("/menu");
}
