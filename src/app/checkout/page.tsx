import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const session = await auth();

  // Protect route
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  // Fetch saved addresses
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  // Fetch delivery slots
  const deliverySlots = await prisma.deliverySlot.findMany({
    where: { isActive: true },
    orderBy: [{ mealType: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-secondary/20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading mb-8">Checkout</h1>
        <CheckoutClient 
          initialAddresses={addresses} 
          deliverySlots={deliverySlots} 
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
