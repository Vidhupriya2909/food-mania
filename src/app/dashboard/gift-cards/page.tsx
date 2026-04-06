import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardGiftCardsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const purchasedCards = await prisma.giftCard.findMany({
    where: { purchasedById: session.user.id },
    orderBy: { purchasedAt: "desc" },
  });

  const redeemedCards = await prisma.giftCard.findMany({
    where: { redeemedById: session.user.id },
    orderBy: { purchasedAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Gift Cards</h1>
        <Link href="/gift-cards">
          <Button variant="outline" size="sm" className="gap-2">
            <Gift className="w-4 h-4" />
            Buy Gift Card
          </Button>
        </Link>
      </div>

      {/* Purchased Gift Cards */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">Purchased</h2>
        {purchasedCards.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven&apos;t purchased any gift cards yet.</p>
              <Link href="/gift-cards" className="mt-4 inline-block">
                <Button variant="gradient" size="sm" className="gap-2">
                  Send a Gift Card <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {purchasedCards.map((card) => (
              <Card key={card.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-saffron-500" />
                      <span className="font-mono text-sm font-bold">{card.code}</span>
                    </div>
                    <Badge variant={card.status === "ACTIVE" ? "default" : card.status === "FULLY_REDEEMED" ? "secondary" : "outline"}>
                      {card.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span className="font-bold text-foreground">₹{card.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance</span>
                      <span className="font-medium text-foreground">₹{card.balance}</span>
                    </div>
                    {card.recipientName && (
                      <div className="flex justify-between">
                        <span>To</span>
                        <span>{card.recipientName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Purchased</span>
                      <span>{new Date(card.purchasedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Redeemed Gift Cards */}
      {redeemedCards.length > 0 && (
        <div>
          <h2 className="text-lg font-heading font-semibold mb-3">Redeemed</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {redeemedCards.map((card) => (
              <Card key={card.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm">{card.code}</span>
                      <div className="text-sm text-muted-foreground mt-1">₹{card.amount} added to wallet</div>
                    </div>
                    <Badge variant="secondary">Redeemed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
