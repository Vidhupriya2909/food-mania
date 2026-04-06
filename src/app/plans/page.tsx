"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Calendar,
  ArrowRight,
  Sparkles,
  Sun,
  Cloud,
  Moon,
} from "lucide-react";

import { Loader2 } from "lucide-react";

const MEAL_OPTIONS = [
  { type: "BREAKFAST", label: "Breakfast", icon: Sun, time: "7-10 AM", emoji: "☀️", color: "text-amber-500" },
  { type: "LUNCH", label: "Lunch", icon: Cloud, time: "12-2 PM", emoji: "🌤️", color: "text-saffron-500" },
  { type: "DINNER", label: "Dinner", icon: Moon, time: "7-10 PM", emoji: "🌙", color: "text-spice-500" },
];

export default function PlansPage() {
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["BREAKFAST", "LUNCH", "DINNER"]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Add UI specific properties to plans dynamically
          const formattedPlans = data.plans.map((p: any) => {
            const baseMealPrice = 99;
            const singleMealPlanPrice = Math.round(baseMealPrice * p.durationDays * (1 - p.discountPercent / 100));
            return {
              ...p,
              basePlanPrice: singleMealPlanPrice,
              unit: p.durationDays === 1 ? "/meal" : p.durationDays === 7 ? "/week" : "/month",
              popular: p.durationDays === 7, // Make weekly popular by default
              gradient: p.durationDays === 1 ? "from-saffron-400 to-saffron-500" : p.durationDays === 7 ? "from-spice-400 to-spice-600" : "from-herb-400 to-herb-600",
              icon: p.durationDays === 1 ? Calendar : p.durationDays === 7 ? Star : Sparkles,
            };
          });
          setPlans(formattedPlans);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) => {
      if (prev.includes(meal)) {
        if (prev.length === 1) return prev; // Must have at least one
        return prev.filter((m) => m !== meal);
      }
      return [...prev, meal];
    });
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter" id="plans-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-herb-100 text-herb-800 dark:bg-herb-900/30 dark:text-herb-400 border-none">
            Subscription Plans
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Choose your <span className="gradient-text">perfect plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed for every lifestyle. Mix and match meals, skip days, and cancel anytime. No lock-in contracts.
          </p>
        </div>

        {/* Meal Selection */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-center font-heading font-semibold mb-4">
            Select your meals
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Choose one, two, or all three meal times. You can always change later.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {MEAL_OPTIONS.map((meal) => (
              <button
                key={meal.type}
                onClick={() => toggleMeal(meal.type)}
                id={`plan-meal-${meal.type.toLowerCase()}`}
                className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-center group ${
                  selectedMeals.includes(meal.type)
                    ? "border-saffron-400 bg-saffron-50 dark:bg-saffron-900/20 shadow-lg shadow-saffron-500/10"
                    : "border-border hover:border-muted-foreground/30 hover:bg-secondary/50"
                }`}
              >
                {selectedMeals.includes(meal.type) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-saffron-500 rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="text-3xl sm:text-4xl mb-2">{meal.emoji}</div>
                <h3 className="font-heading font-semibold text-sm sm:text-base">{meal.label}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{meal.time}</p>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            {selectedMeals.length === 1 ? "1 meal" : selectedMeals.length === 2 ? "2 meals" : "All 3 meals"} selected
          </p>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground mb-16">
            <Loader2 className="h-10 w-10 animate-spin text-saffron-500 mb-4" />
            <p>Fetching plans...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan, index) => {
              const finalPrice = (plan.basePlanPrice || 99) * selectedMeals.length;
              return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-saffron-400 shadow-xl shadow-saffron-500/10 md:scale-105 z-10"
                    : "border hover:shadow-lg"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-saffron-400 via-spice-500 to-saffron-400" />
                )}

                {plan.popular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 translate-y-2">
                    <Badge className="bg-gradient-to-r from-saffron-500 to-spice-500 text-white border-none px-4 shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className={plan.popular ? "pt-12 pb-8 px-6" : "pt-8 pb-8 px-6"}>
                  <div className="text-center space-y-4">
                    {/* Plan Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                      <plan.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Plan Name */}
                    <div>
                      <h3 className="text-xl font-bold font-heading">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="py-2">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-muted-foreground">₹</span>
                        <span className="text-4xl font-bold font-heading">{finalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-sm text-muted-foreground">{plan.unit}</span>
                      </div>
                      {plan.discountPercent > 0 && (
                        <Badge variant="success" className="mt-2">
                          Save {plan.discountPercent}%
                        </Badge>
                      )}
                    </div>

                    {/* Meal count display */}
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <span className="text-muted-foreground">For</span>
                      <span className="font-medium">
                        {selectedMeals.length} meal{selectedMeals.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-muted-foreground">/ day</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-herb-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={`/customize?plan=${plan.id}&meals=${selectedMeals.join(",")}`} className="block mt-8">
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      className="w-full gap-2"
                      size="lg"
                      id={`plan-select-${plan.type.toLowerCase()}`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch between plans?",
                a: "Yes! You can upgrade or downgrade your plan anytime. Changes will take effect from the next billing cycle.",
              },
              {
                q: "How do I skip a day?",
                a: "Simply go to your dashboard, select the day you want to skip, and confirm. You won't be charged for skipped days on weekly/monthly plans.",
              },
              {
                q: "Can I choose different meals for each day?",
                a: "Absolutely! You can customize your menu for each day of your subscription. Browse the daily rotating menu and pick your favorites.",
              },
              {
                q: "What if I want to cancel?",
                a: "You can cancel your subscription anytime from your dashboard. No questions asked, no cancellation fees. Unused credit will be refunded.",
              },
              {
                q: "Do you deliver to my area?",
                a: "We currently serve major areas in Bangalore. Enter your pincode at checkout to verify if we deliver to your location.",
              },
            ].map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-sm mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
