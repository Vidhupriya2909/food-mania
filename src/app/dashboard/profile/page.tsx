import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Shield } from "lucide-react";
import ProfileForm from "./ProfileForm";
import { SessionProvider } from "next-auth/react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      phoneVerified: true,
      image: true,
      role: true,
      referralCode: true,
      walletBalance: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-heading">My Profile</h1>

      <SessionProvider>
        <ProfileForm
          initialData={{
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            phoneVerified: user.phoneVerified,
            image: user.image || null,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      </SessionProvider>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-saffron-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Wallet Balance</div>
                <div className="text-2xl font-bold font-heading">₹{user.walletBalance}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-herb-100 dark:bg-herb-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-herb-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Referral Code</div>
                <div className="text-lg font-bold font-heading font-mono">{user.referralCode || "N/A"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
