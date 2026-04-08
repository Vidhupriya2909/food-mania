"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Check,
  Star,
  Calendar,
  ArrowRight,
  Sparkles,
  Sun,
  Cloud,
  Moon,
  CalendarDays,
  Minus,
  Plus,
  Settings2,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";

const MEAL_OPTIONS = [
  { type: "BREAKFAST", label: "Breakfast", icon: Sun, time: "7-10 AM", emoji: "☀️", color: "text-amber-500" },
  { type: "LUNCH", label: "Lunch", icon: Cloud, time: "12-2 PM", emoji: "🌤️", color: "text-saffron-500" },
  { type: "DINNER", label: "Dinner", icon: Moon, time: "7-10 PM", emoji: "🌙", color: "text-spice-500" },
];

export default function PlansPage() {
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["BREAKFAST", "LUNCH", "DINNER"]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Custom plan state
  const [customDays, setCustomDays] = useState(10);
  const [customMealsPerDay, setCustomMealsPerDay] = useState<Record<string, number>>({
    BREAKFAST: 1,
    LUNCH: 1,
    DINNER: 1,
  });

  React.useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedPlans = data.plans.map((p: any) => {
            const baseMealPrice = 99;
            const singleMealPlanPrice = Math.round(baseMealPrice * p.durationDays * (1 - p.discountPercent / 100));
            return {
              ...p,
              basePlanPrice: singleMealPlanPrice,
              unit: p.durationDays === 1 ? "/day" : p.durationDays === 7 ? "/week" : "/month",
              popular: p.durationDays === 7,
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
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== meal);
      }
      return [...prev, meal];
    });
  };

  const getEndDate = (durationDays: number) => addDays(startDate, durationDays - 1);

  const buildCustomizeUrl = (planId: string, durationDays: number, includedPerMeal: number) => {
    const mealsParam = selectedMeals.join(",");
    const startParam = format(startDate, "yyyy-MM-dd");
    return `/customize?plan=${planId}&meals=${mealsParam}&start=${startParam}&duration=${durationDays}&included=${includedPerMeal}`;
  };

  const buildCustomUrl = () => {
    const activeMeals = selectedMeals.filter((m) => customMealsPerDay[m] > 0);
    const mealsParam = activeMeals.join(",");
    const startParam = format(startDate, "yyyy-MM-dd");
    const mealsPerDayParam = activeMeals.map((m) => `${m}:${customMealsPerDay[m]}`).join(",");
    return `/customize?plan=custom&meals=${mealsParam}&start=${startParam}&duration=${customDays}&included=1&mealsPerDay=${mealsPerDayParam}`;
  };

  const customPlanPrice = () => {
    const baseMealPrice = 99;
    let total = 0;
    selectedMeals.forEach((meal) => {
      total += baseMealPrice * customDays * (customMealsPerDay[meal] || 1);
    });
    return total;
  };

  const tomorrow = addDays(new Date(), 1);

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
            Flexible plans designed for every lifestyle. Each plan includes 1 item per meal. Add extras at menu price.
          </p>
        </div>

        {/* Meal Selection */}
        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-center font-heading font-semibold mb-4">
            Select your meals
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Choose one, two, or all three meal times. 1 item included per meal — extras are chargeable.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {MEAL_OPTIONS.map((meal) => (
              <button
                key={meal.type}
                onClick={() => toggleMeal(meal.type)}
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

        {/* Start Date Picker */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex items-center justify-center gap-3">
            <CalendarDays className="w-5 h-5 text-saffron-500" />
            <span className="font-heading font-semibold">Start Date:</span>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 font-medium">
                  <Calendar className="w-4 h-4" />
                  {format(startDate, "EEE, MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => date < tomorrow}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground mb-16">
            <Loader2 className="h-10 w-10 animate-spin text-saffron-500 mb-4" />
            <p>Fetching plans...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
              {plans.map((plan, index) => {
                const finalPrice = (plan.basePlanPrice || 99) * selectedMeals.length;
                const endDate = getEndDate(plan.durationDays);
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
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                          <plan.icon className="w-7 h-7 text-white" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold font-heading">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>

                        <div className="py-2">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-sm text-muted-foreground">₹</span>
                            <span className="text-4xl font-bold font-heading">{finalPrice.toLocaleString("en-IN")}</span>
                            <span className="text-sm text-muted-foreground">{plan.unit}</span>
                          </div>
                          {plan.discountPercent > 0 && (
                            <Badge variant="outline" className="mt-2 text-herb-600 border-herb-300">
                              Save {plan.discountPercent}%
                            </Badge>
                          )}
                        </div>

                        {/* Date Range */}
                        <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Start</span>
                            <span className="font-medium">{format(startDate, "MMM d")}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-muted-foreground">End</span>
                            <span className="font-medium">{format(endDate, "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{plan.durationDays} days</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-sm">
                          <span className="text-muted-foreground">Includes</span>
                          <span className="font-medium">1 item / meal / day</span>
                        </div>
                      </div>

                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature: string) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-herb-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={buildCustomizeUrl(plan.id, plan.durationDays, 1)} className="block mt-8">
                        <Button
                          variant={plan.popular ? "gradient" : "outline"}
                          className="w-full gap-2"
                          size="lg"
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

            {/* Custom Plan */}
            <div className="max-w-3xl mx-auto mb-16">
              <Card className="border-2 border-dashed border-saffron-300 dark:border-saffron-700">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-400 via-spice-500 to-herb-500 flex items-center justify-center shadow-lg">
                      <Settings2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-heading">Custom Plan</h3>
                      <p className="text-sm text-muted-foreground">Set your own duration and meals per day</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Duration */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Number of Days
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCustomDays((d) => Math.max(2, d - 1))}
                          disabled={customDays <= 2}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <span className="text-3xl font-bold font-heading">{customDays}</span>
                          <span className="text-sm text-muted-foreground ml-2">days</span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCustomDays((d) => Math.min(90, d + 1))}
                          disabled={customDays >= 90}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start</span>
                          <span className="font-medium">{format(startDate, "MMM d")}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">End</span>
                          <span className="font-medium">{format(getEndDate(customDays), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meals per day */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Included Items per Meal
                      </label>
                      {selectedMeals.map((meal) => {
                        const info = MEAL_OPTIONS.find((m) => m.type === meal);
                        return (
                          <div key={meal} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <span>{info?.emoji}</span>
                              <span className="text-sm font-medium">{info?.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  setCustomMealsPerDay((prev) => ({
                                    ...prev,
                                    [meal]: Math.max(1, (prev[meal] || 1) - 1),
                                  }))
                                }
                                disabled={(customMealsPerDay[meal] || 1) <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-bold w-6 text-center">
                                {customMealsPerDay[meal] || 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  setCustomMealsPerDay((prev) => ({
                                    ...prev,
                                    [meal]: Math.min(5, (prev[meal] || 1) + 1),
                                  }))
                                }
                                disabled={(customMealsPerDay[meal] || 1) >= 5}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Estimated total</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground">₹</span>
                        <span className="text-3xl font-bold font-heading">{customPlanPrice().toLocaleString("en-IN")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Base price &middot; extras charged at menu price
                      </div>
                    </div>
                    <Link href={buildCustomUrl()}>
                      <Button variant="gradient" size="lg" className="gap-2">
                        Customize Meals
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What does '1 item included per meal' mean?",
                a: "Each plan includes 1 menu item per meal type per day at no extra cost. Want more variety? You can add extra items during customization — they're charged at the menu price.",
              },
              {
                q: "Can I switch between plans?",
                a: "Yes! You can upgrade or downgrade your plan anytime. Changes will take effect from the next billing cycle.",
              },
              {
                q: "How does the Custom Plan work?",
                a: "Set your own duration (2-90 days) and choose how many items you want included per meal. Great for special diets or hosting guests.",
              },
              {
                q: "Can I choose different meals for each day?",
                a: "Absolutely! After selecting your plan, you'll customize the menu for each day. Pick your included item and add extras if you'd like.",
              },
              {
                q: "What if I want to cancel?",
                a: "You can cancel your subscription anytime from your dashboard. No questions asked, no cancellation fees.",
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
