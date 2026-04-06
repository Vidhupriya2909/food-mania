"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Send, CreditCard, Sparkles } from "lucide-react";

const GIFT_CARD_AMOUNTS = [250, 500, 1000, 2000, 5000];

const GIFT_CARD_DESIGNS = [
  { id: 1, name: "Birthday Feast", emoji: "🎂", gradient: "from-pink-400 to-rose-500" },
  { id: 2, name: "Thank You", emoji: "🙏", gradient: "from-saffron-400 to-spice-500" },
  { id: 3, name: "Congratulations", emoji: "🎉", gradient: "from-herb-400 to-herb-600" },
  { id: 4, name: "Just Because", emoji: "💝", gradient: "from-purple-400 to-violet-500" },
];

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [selectedDesign, setSelectedDesign] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [redeemCode, setRedeemCode] = useState("");

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-400 border-none">
            <Gift className="w-3 h-3 mr-1" /> Gift Cards
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Share the joy of <span className="gradient-text">great food</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Give someone special the gift of delicious meals. Food Mart gift cards never expire and can be used for any order.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Purchase Section */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold font-heading">Send a Gift Card</h2>

            {/* Design Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Choose a design</label>
              <div className="grid grid-cols-2 gap-3">
                {GIFT_CARD_DESIGNS.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedDesign === design.id
                        ? "border-saffron-400 shadow-lg shadow-saffron-500/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="text-3xl mb-1">{design.emoji}</div>
                    <div className="text-xs font-medium">{design.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select amount</label>
              <div className="flex flex-wrap gap-2">
                {GIFT_CARD_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                      selectedAmount === amount
                        ? "border-saffron-400 bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-400"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    ₹{amount.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-4">
              <Input
                placeholder="Recipient's name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <Input
                placeholder="Recipient's email or phone"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <textarea
                placeholder="Add a personal message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
            </div>

            <Button variant="gradient" className="w-full gap-2" size="lg">
              <Send className="w-4 h-4" />
              Purchase Gift Card - ₹{selectedAmount.toLocaleString("en-IN")}
            </Button>
          </div>

          {/* Preview & Redeem Section */}
          <div className="space-y-8">
            {/* Card Preview */}
            <div>
              <h2 className="text-xl font-bold font-heading mb-4">Preview</h2>
              <Card className="overflow-hidden">
                <div className={`bg-gradient-to-br ${GIFT_CARD_DESIGNS.find((d) => d.id === selectedDesign)?.gradient} p-8 text-white`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-sm opacity-80">Food Mart</div>
                      <div className="text-lg font-bold font-heading">Gift Card</div>
                    </div>
                    <Sparkles className="w-8 h-8 opacity-60" />
                  </div>
                  <div className="text-4xl mb-2">{GIFT_CARD_DESIGNS.find((d) => d.id === selectedDesign)?.emoji}</div>
                  <div className="text-2xl font-bold font-heading">₹{selectedAmount.toLocaleString("en-IN")}</div>
                  {recipientName && <div className="text-sm mt-2 opacity-80">For {recipientName}</div>}
                  {message && <div className="text-xs mt-1 opacity-60 italic">&quot;{message}&quot;</div>}
                </div>
              </Card>
            </div>

            {/* Redeem Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-saffron-500" />
                  Redeem a Gift Card
                </h3>
                <p className="text-sm text-muted-foreground">
                  Have a gift card code? Enter it below to add the balance to your wallet.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter gift card code"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="font-mono uppercase"
                  />
                  <Button variant="outline" disabled={!redeemCode}>
                    Redeem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
