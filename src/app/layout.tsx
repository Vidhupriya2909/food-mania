import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Food Mart - Fresh Meals Delivered Daily | Meal Subscription",
    template: "%s | Food Mart",
  },
  description:
    "Subscribe to delicious, freshly prepared breakfast, lunch & dinner meals. Customize your menu, choose your plan, and get meals delivered to your doorstep. Serving across India.",
  keywords: [
    "meal subscription",
    "food delivery",
    "daily meals",
    "breakfast delivery",
    "lunch delivery",
    "dinner delivery",
    "meal plan",
    "healthy food",
    "tiffin service",
    "home cooked meals",
    "food subscription India",
  ],
  authors: [{ name: "Food Mart" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://foodmart.in",
    siteName: "Food Mart",
    title: "Food Mart - Fresh Meals Delivered Daily",
    description:
      "Subscribe to delicious meals. Customize your menu, choose your plan, and get meals delivered daily.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Mart - Fresh Meals Delivered Daily",
    description:
      "Subscribe to delicious meals delivered to your doorstep every day.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Fetch fresh user data from DB to ensure name/image are current
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, image: true, phone: true, email: true },
    });
    if (dbUser) {
      session.user.name = dbUser.name;
      session.user.image = dbUser.image;
      (session.user as any).phone = dbUser.phone;
      if (dbUser.email) session.user.email = dbUser.email;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar session={session} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
