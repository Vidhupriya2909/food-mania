"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  Star,
  ArrowRight,
  Minus,
  Plus,
  CalendarDays,
  Loader2,
  Zap,
  Crown,
  Settings2,
} from "lucide-react";
import { format, addDays } from "date-fns";

const MEAL_PREFERENCES = [
  { type: "BREAKFAST", label: "Breakfast", time: "7 - 10 AM" },
  { type: "LUNCH", label: "Lunch", time: "12 - 2 PM" },
  { type: "DINNER", label: "Dinner", time: "7 - 10 PM" },
];

const DIET_TYPES = [
  { value: "VEG", label: "Vegetarian", icon: "🟢" },
  { value: "NON_VEG", label: "Non-Vegetarian", icon: "🔴" },
  { value: "VEGAN", label: "Vegan", icon: "🌱" },
  { value: "EGGETARIAN", label: "Eggetarian", icon: "🟡" },
];

export default function PlansPage() {
  const router = useRouter();
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["LUNCH", "DINNER"]);
  const [dietType, setDietType] = useState("VEG");
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customDays, setCustomDays] = useState(14);

  const BASE_MEAL_PRICE = 99;

  React.useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPlans(data.plans);
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

  const totalMealsPerDay = selectedMeals.length;

  const getPlanPrice = (durationDays: number, discountPercent: number) => {
    const perMeal = Math.round(BASE_MEAL_PRICE * (1 - discountPercent / 100));
    const totalMeals = durationDays * totalMealsPerDay;
    const total = perMeal * totalMeals;
    return { perMeal, totalMeals, total };
  };

  const getCustomPrice = () => {
    const totalMeals = customDays * totalMealsPerDay;
    // 5% discount for custom plans > 7 days, 15% for > 30 days
    const discount = customDays >= 30 ? 15 : customDays >= 7 ? 5 : 0;
    const perMeal = Math.round(BASE_MEAL_PRICE * (1 - discount / 100));
    const total = perMeal * totalMeals;
    return { perMeal, totalMeals, total, discount };
  };

  const handleTakePlan = (planId: string, durationDays: number) => {
    const params = new URLSearchParams({
      plan: planId,
      meals: selectedMeals.join(","),
      diet: dietType,
      start: format(startDate, "yyyy-MM-dd"),
      duration: durationDays.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const handleCustomPlan = () => {
    const params = new URLSearchParams({
      plan: "custom",
      meals: selectedMeals.join(","),
      diet: dietType,
      start: format(startDate, "yyyy-MM-dd"),
      duration: customDays.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const tomorrow = addDays(new Date(), 1);

  const planMeta = [
    { label: "Trial", icon: Zap, tag: null, gradient: "from-saffron-400 to-saffron-500" },
    { label: "Popular", icon: Star, tag: "Most Popular", gradient: "from-spice-400 to-spice-600" },
    { label: "Best Deal", icon: Crown, tag: "Best Value", gradient: "from-herb-400 to-herb-600" },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
            Healthy Meals, <span className="gradient-text">Delivered Daily</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose your preferences, pick a plan, and we&apos;ll deliver fresh calorie-counted meals to your doorstep.
          </p>
        </div>

        {/* Preferences Section */}
        <Card className="mb-10">
          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Meal Preferences */}
            <div>
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Meal Preference
              </h3>
              <div className="flex flex-wrap gap-3">
                {MEAL_PREFERENCES.map((meal) => (
                  <button
                    key={meal.type}
                    onClick={() => toggleMeal(meal.type)}
                    className={`relative flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all text-left ${
                      selectedMeals.includes(meal.type)
                        ? "border-saffron-500 bg-saffron-50 dark:bg-saffron-900/20"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedMeals.includes(meal.type)
                          ? "bg-saffron-500 border-saffron-500"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedMeals.includes(meal.type) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{meal.label}</div>
                      <div className="text-[11px] text-muted-foreground">{meal.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type */}
            <div>
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Meal Type
              </h3>
              <div className="flex flex-wrap gap-3">
                {DIET_TYPES.map((diet) => (
                  <button
                    key={diet.value}
                    onClick={() => setDietType(diet.value)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
                      dietType === diet.value
                        ? "border-saffron-500 bg-saffron-50 dark:bg-saffron-900/20"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-lg">{diet.icon}</span>
                    <span className="font-medium text-sm">{diet.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Start Date
              </h3>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 h-12 px-5">
                    <CalendarDays className="w-4 h-4 text-saffron-500" />
                    <span className="font-medium">{format(startDate, "EEEE, MMMM d, yyyy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mb-6">
          Prices exclude GST and delivery charges
        </p>

        {/* Plan Cards */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-saffron-500 mb-3" />
            <p className="text-sm">Loading plans...</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {plans.map((plan, index) => {
                const meta = planMeta[index] || planMeta[0];
                const pricing = getPlanPrice(plan.durationDays, plan.discountPercent);
                const endDate = addDays(startDate, plan.durationDays - 1);

                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                      meta.tag
                        ? "border-saffron-400 shadow-xl shadow-saffron-500/10"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {meta.tag && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-400 via-spice-500 to-saffron-400" />
                    )}

                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Tag */}
                      {meta.tag && (
                        <Badge className="bg-gradient-to-r from-saffron-500 to-spice-500 text-white border-none w-fit mb-4">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {meta.tag}
                        </Badge>
                      )}

                      {/* Plan name */}
                      <h3 className="text-lg font-bold font-heading">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      )}

                      {/* Price */}
                      <div className="mt-4 mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold font-heading">
                            ₹{pricing.perMeal}
                          </span>
                          <span className="text-muted-foreground text-sm">/meal</span>
                        </div>
                        {plan.discountPercent > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{BASE_MEAL_PRICE}
                            </span>
                            <Badge variant="outline" className="text-herb-600 border-herb-300 text-xs">
                              Save {plan.discountPercent}%
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{plan.durationDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total meals</span>
                          <span className="font-medium">{pricing.totalMeals} meals</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Period</span>
                          <span className="font-medium">
                            {format(startDate, "MMM d")} — {format(endDate, "MMM d")}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t font-bold">
                          <span>Total</span>
                          <span>₹{pricing.total.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto">
                        <Button
                          variant={meta.tag ? "gradient" : "outline"}
                          className="w-full gap-2"
                          size="lg"
                          onClick={() => handleTakePlan(plan.id, plan.durationDays)}
                        >
                          Take this plan
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Custom Plan */}
            <Card className="mb-16">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 via-spice-500 to-herb-500 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading">Custom Duration</h3>
                    <p className="text-sm text-muted-foreground">Choose 1 - 90 days</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Duration selector */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCustomDays((d) => Math.max(1, d - 1))}
                      disabled={customDays <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center w-24">
                      <span className="text-3xl font-bold font-heading">{customDays}</span>
                      <span className="text-sm text-muted-foreground ml-1">days</span>
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

                  {/* Pricing summary */}
                  <div className="flex-1 bg-secondary/50 rounded-lg p-4 text-sm w-full">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Per meal</span>
                      <span className="font-medium">₹{getCustomPrice().perMeal}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Total meals</span>
                      <span className="font-medium">{getCustomPrice().totalMeals}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Period</span>
                      <span className="font-medium">
                        {format(startDate, "MMM d")} — {format(addDays(startDate, customDays - 1), "MMM d")}
                      </span>
                    </div>
                    {getCustomPrice().discount > 0 && (
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-herb-600">{getCustomPrice().discount}% off</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 mt-2 border-t font-bold text-base">
                      <span>Total</span>
                      <span>₹{getCustomPrice().total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="gradient"
                    size="lg"
                    className="gap-2 whitespace-nowrap"
                    onClick={handleCustomPlan}
                  >
                    Take this plan
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* How it works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Choose your plan", desc: "Select meals, diet type, and plan duration" },
              { step: "2", title: "We prepare fresh", desc: "Our chefs prepare calorie-counted meals daily" },
              { step: "3", title: "Delivered to you", desc: "Fresh meals delivered to your doorstep on time" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-spice-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I pause or cancel my subscription?",
                a: "Yes, you can pause or cancel anytime from your dashboard. No cancellation fees.",
              },
              {
                q: "When are meals delivered?",
                a: "Breakfast is delivered by 8 AM, Lunch between 12-1 PM, and Dinner between 7-8 PM.",
              },
              {
                q: "Can I change my diet type mid-plan?",
                a: "Yes! Contact us and we'll adjust your remaining meals accordingly.",
              },
              {
                q: "Do you deliver to my area?",
                a: "We currently serve major areas. Enter your pincode at checkout to verify delivery availability.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-sm mb-1">{faq.q}</h3>
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
