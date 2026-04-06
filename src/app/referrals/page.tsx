import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Gift, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ReferralsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/referrals");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, walletBalance: true },
  });

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { referee: { select: { name: true, phone: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  const completedCount = referrals.filter((r) => r.status === "COMPLETED").length;
  const totalEarned = referrals
    .filter((r) => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-herb-100 text-herb-800 dark:bg-herb-900/30 dark:text-herb-400 border-none">
            <Users className="w-3 h-3 mr-1" /> Invite Friends
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Refer friends, <span className="gradient-text">earn rewards</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Share your referral code. When your friend places their first order, you both get ₹100 in wallet credits!
          </p>
        </div>

        {/* Referral Code Card */}
        <Card className="mb-8 border-saffron-200 dark:border-saffron-800">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Your Referral Code</h2>
            <div className="inline-flex items-center gap-3 bg-secondary px-6 py-3 rounded-xl mb-4">
              <span className="text-2xl font-bold font-heading tracking-wider">
                {user?.referralCode || "N/A"}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" /> Share via WhatsApp
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" /> Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-saffron-500 mx-auto mb-2" />
              <div className="text-2xl font-bold font-heading">{referrals.length}</div>
              <div className="text-sm text-muted-foreground">Total Invites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 text-herb-500 mx-auto mb-2" />
              <div className="text-2xl font-bold font-heading">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <span className="text-2xl block mb-2">💰</span>
              <div className="text-2xl font-bold font-heading">₹{totalEarned}</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral History */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold mb-4">Referral History</h3>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No referrals yet. Share your code to get started!</p>
              </div>
            ) : (
              <div className="divide-y">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-sm">{ref.referee.name || ref.referee.phone}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={ref.status === "COMPLETED" ? "default" : "outline"}>
                      {ref.status === "COMPLETED" ? `+₹${ref.rewardAmount}` : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold font-heading mb-6">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Share your code", desc: "Send your referral code to friends & family" },
              { step: "2", title: "Friend orders", desc: "They sign up and place their first order" },
              { step: "3", title: "You both earn", desc: "₹100 wallet credit for both of you!" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-saffron-100 dark:bg-saffron-900/30 text-saffron-600 font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
