"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") throw new Error("Unauthorized");

  const validStatuses = ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED", "PENDING"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  const updateData: any = { status: status as any };

  if (status === "CANCELLED") {
    updateData.cancelledAt = new Date();
    updateData.cancellationReason = "Cancelled by admin";
  }

  if (status === "ACTIVE") {
    updateData.cancelledAt = null;
    updateData.cancellationReason = null;
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: updateData,
  });

  revalidatePath("/admin/subscriptions");
}
