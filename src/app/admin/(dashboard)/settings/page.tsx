import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, IndianRupee, Truck, Gift, Clock, Shield } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await prisma.appSettings.findFirst({
    where: { id: "default" },
  });

  if (!settings) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Settings className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>No settings found. Run the seed script to initialize defaults.</p>
      </div>
    );
  }

  const settingsGroups = [
    {
      title: "Pricing & Tax",
      icon: IndianRupee,
      items: [
        { label: "Tax Rate", value: `${settings.taxRatePercent}%` },
        { label: "Free Delivery Threshold", value: `₹${settings.freeDeliveryThreshold}` },
        { label: "Default Delivery Charge", value: `₹${settings.defaultDeliveryCharge}` },
      ],
    },
    {
      title: "Referrals & Rewards",
      icon: Gift,
      items: [
        { label: "Referral Reward (Referrer)", value: `₹${settings.referralRewardAmount}` },
        { label: "Referral Bonus (Referee)", value: `₹${settings.referralRefereeBonus}` },
        { label: "Gift Card Validity", value: `${settings.giftCardValidityDays} days` },
      ],
    },
    {
      title: "OTP Settings",
      icon: Clock,
      items: [
        { label: "Max OTP Attempts", value: `${settings.maxOtpAttempts}` },
        { label: "OTP Expiry", value: `${settings.otpExpiryMinutes} minutes` },
      ],
    },
    {
      title: "System",
      icon: Shield,
      items: [
        { label: "App Name", value: settings.appName },
        { label: "Maintenance Mode", value: settings.maintenanceMode ? "ON" : "OFF" },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">App Settings</h1>
        <Badge variant="outline" className="text-xs">
          Read Only
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {settingsGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <group.icon className="w-4 h-4 text-saffron-500" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
