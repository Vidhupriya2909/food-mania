"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to verify admin access
async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  return session.user.id;
}

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createMenuItem(formData: FormData) {
  await verifyAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const categoryId = formData.get("categoryId") as string;
  const dietaryType = formData.get("dietaryType") as string;
  const spiceLevel = formData.get("spiceLevel") as string;
  const calories = formData.get("calories") ? parseInt(formData.get("calories") as string) : null;
  const protein = formData.get("protein") ? parseFloat(formData.get("protein") as string) : null;
  const carbs = formData.get("carbs") ? parseFloat(formData.get("carbs") as string) : null;
  const fat = formData.get("fat") ? parseFloat(formData.get("fat") as string) : null;
  const fiber = formData.get("fiber") ? parseFloat(formData.get("fiber") as string) : null;
  const image = (formData.get("image") as string) || null;
  const servingSize = (formData.get("servingSize") as string) || null;
  const preparationTime = formData.get("preparationTime") ? parseInt(formData.get("preparationTime") as string) : null;
  const isActive = formData.get("isActive") === "true";
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const isJainFriendly = formData.get("isJainFriendly") === "true";
  const allergensRaw = (formData.get("allergens") as string) || "";
  const allergens = allergensRaw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  // Generate a unique slug
  let slug = generateSlug(name);
  const existing = await prisma.menuItem.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  await prisma.menuItem.create({
    data: {
      name,
      slug,
      description,
      basePrice,
      categoryId,
      dietaryType: dietaryType as any,
      spiceLevel: spiceLevel as any,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      image,
      servingSize,
      preparationTime,
      isActive,
      isGlutenFree,
      isJainFriendly,
      allergens,
    },
  });

  revalidatePath("/admin/menu-items");
  revalidatePath("/menu");
  redirect("/admin/menu-items");
}

export async function updateMenuItem(id: string, formData: FormData) {
  await verifyAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const categoryId = formData.get("categoryId") as string;
  const dietaryType = formData.get("dietaryType") as string;
  const spiceLevel = formData.get("spiceLevel") as string;
  const calories = formData.get("calories") ? parseInt(formData.get("calories") as string) : null;
  const protein = formData.get("protein") ? parseFloat(formData.get("protein") as string) : null;
  const carbs = formData.get("carbs") ? parseFloat(formData.get("carbs") as string) : null;
  const fat = formData.get("fat") ? parseFloat(formData.get("fat") as string) : null;
  const fiber = formData.get("fiber") ? parseFloat(formData.get("fiber") as string) : null;
  const image = (formData.get("image") as string) || null;
  const servingSize = (formData.get("servingSize") as string) || null;
  const preparationTime = formData.get("preparationTime") ? parseInt(formData.get("preparationTime") as string) : null;
  const isActive = formData.get("isActive") === "true";
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const isJainFriendly = formData.get("isJainFriendly") === "true";
  const allergensRaw = (formData.get("allergens") as string) || "";
  const allergens = allergensRaw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  // Check if name changed → update slug
  const current = await prisma.menuItem.findUnique({ where: { id } });
  let slug = current?.slug || generateSlug(name);

  if (current && current.name !== name) {
    slug = generateSlug(name);
    const existing = await prisma.menuItem.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      basePrice,
      categoryId,
      dietaryType: dietaryType as any,
      spiceLevel: spiceLevel as any,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      image,
      servingSize,
      preparationTime,
      isActive,
      isGlutenFree,
      isJainFriendly,
      allergens,
    },
  });

  revalidatePath("/admin/menu-items");
  revalidatePath("/menu");
  redirect("/admin/menu-items");
}

export async function deleteMenuItem(id: string) {
  await verifyAdmin();

  // Check if item has any active orders or subscriptions
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orderItems: true, subscriptionItems: true },
      },
    },
  });

  if (!item) throw new Error("Item not found");

  // If item has order history, soft-delete by marking inactive instead
  if (item._count.orderItems > 0 || item._count.subscriptionItems > 0) {
    await prisma.menuItem.update({
      where: { id },
      data: { isActive: false },
    });
  } else {
    // Safe to hard delete — remove related daily menus first
    await prisma.dailyMenu.deleteMany({ where: { menuItemId: id } });
    await prisma.menuItem.delete({ where: { id } });
  }

  revalidatePath("/admin/menu-items");
  revalidatePath("/menu");
  redirect("/admin/menu-items");
}
