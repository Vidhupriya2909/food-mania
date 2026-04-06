import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Calendar, Wallet, Shield } from "lucide-react";

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-saffron-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name || "Not set"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.phone || "Not set"}</span>
                {user.phoneVerified && (
                  <Badge variant="outline" className="ml-auto text-herb-600 border-herb-300 text-[10px]">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.email || "Not set"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Member Since</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
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
            <div className="flex items-center gap-3 mb-3">
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
