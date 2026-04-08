"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  ShoppingCart,
  Star,
  IndianRupee,
  Info,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { format, addDays, differenceInCalendarDays } from "date-fns";

interface MenuItem {
  id: string;
  dailyMenuId: string;
  name: string;
  basePrice: number;
  specialPrice?: number;
  image: string;
  dietaryType: string;
  mealType: string;
  category: { name: string };
}

function CustomizeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "";
  const meals = searchParams.get("meals")?.split(",") || ["BREAKFAST", "LUNCH", "DINNER"];
  const startDateStr = searchParams.get("start");
  const duration = parseInt(searchParams.get("duration") || "7", 10);
  const includedPerMeal = parseInt(searchParams.get("included") || "1", 10);

  // Parse mealsPerDay for custom plans: "BREAKFAST:2,LUNCH:1"
  const mealsPerDayParam = searchParams.get("mealsPerDay");
  const mealsPerDay: Record<string, number> = {};
  if (mealsPerDayParam) {
    mealsPerDayParam.split(",").forEach((entry) => {
      const [meal, count] = entry.split(":");
      mealsPerDay[meal] = parseInt(count, 10) || 1;
    });
  }
  // For standard plans, included per meal is the same for all meals
  const getIncludedCount = (mealType: string) => {
    if (mealsPerDayParam && mealsPerDay[mealType] !== undefined) {
      return mealsPerDay[mealType];
    }
    return includedPerMeal;
  };

  const startDate = startDateStr ? new Date(startDateStr + "T00:00:00") : new Date();
  const endDate = addDays(startDate, duration - 1);

  const [currentDate, setCurrentDate] = useState(startDate);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // selectedItems: { "2026-04-08-BREAKFAST": ["itemId1", "itemId2"], ... }
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, clearCart } = useCart();

  const dateKey = format(currentDate, "yyyy-MM-dd");
  const currentDayIndex = differenceInCalendarDays(currentDate, startDate) + 1;

  const fetchMenu = useCallback((date: Date) => {
    setIsLoading(true);
    const key = format(date, "yyyy-MM-dd");
    fetch(`/api/menu?date=${key}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMenuItems(data.data || []);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchMenu(currentDate);
  }, [currentDate, fetchMenu]);

  const getSelectedForMeal = (mealType: string): string[] => {
    const key = `${dateKey}-${mealType}`;
    return selectedItems[key] || [];
  };

  const toggleItem = (mealType: string, itemId: string) => {
    const key = `${dateKey}-${mealType}`;
    setSelectedItems((prev) => {
      const current = prev[key] || [];
      if (current.includes(itemId)) {
        return { ...prev, [key]: current.filter((id) => id !== itemId) };
      }
      return { ...prev, [key]: [...current, itemId] };
    });
  };

  const isSelected = (mealType: string, itemId: string) => {
    return getSelectedForMeal(mealType).includes(itemId);
  };

  const isIncluded = (mealType: string, itemId: string) => {
    const selected = getSelectedForMeal(mealType);
    const idx = selected.indexOf(itemId);
    if (idx === -1) return false;
    return idx < getIncludedCount(mealType);
  };

  const filteredItems = (mealType: string) =>
    menuItems.filter((item) => item.mealType === mealType);

  const navigateDate = (offset: number) => {
    const newDate = addDays(currentDate, offset);
    if (newDate >= startDate && newDate <= endDate) {
      setCurrentDate(newDate);
    }
  };

  // Calculate summary
  const calculateSummary = () => {
    let includedCount = 0;
    let extraCount = 0;
    let extraCost = 0;

    Object.entries(selectedItems).forEach(([key, itemIds]) => {
      const mealType = key.substring(11);
      const included = getIncludedCount(mealType);

      itemIds.forEach((itemId, idx) => {
        if (idx < included) {
          includedCount++;
        } else {
          extraCount++;
          const item = menuItems.find((m) => m.id === itemId);
          if (item) {
            extraCost += item.specialPrice || item.basePrice;
          }
        }
      });
    });

    return { includedCount, extraCount, extraCost };
  };

  const { includedCount, extraCount, extraCost } = calculateSummary();
  const totalSelected = Object.values(selectedItems).flat().length;

  // Calculate completion: how many days have at least 1 item per selected meal
  const completedDays = (() => {
    let count = 0;
    for (let i = 0; i < duration; i++) {
      const d = format(addDays(startDate, i), "yyyy-MM-dd");
      let dayComplete = true;
      for (const meal of meals) {
        const key = `${d}-${meal}`;
        if (!(selectedItems[key]?.length > 0)) {
          dayComplete = false;
          break;
        }
      }
      if (dayComplete) count++;
    }
    return count;
  })();

  const addAllToCart = () => {
    clearCart();
    // We need menu data for all dates - for now add what we have in selectedItems
    // We'll fetch all items needed
    Object.entries(selectedItems).forEach(([key, itemIds]) => {
      const date = key.substring(0, 10);
      const mealType = key.substring(11);
      const included = getIncludedCount(mealType);

      itemIds.forEach((itemId, idx) => {
        // For now, try to find from current menuItems
        // Items from other dates might not be in memory, but dailyMenuId will be stored
        const item = menuItems.find((m) => m.id === itemId);
        if (item) {
          addToCart({
            dailyMenuId: item.dailyMenuId,
            menuItemId: item.id,
            name: item.name,
            price: idx < included ? 0 : item.specialPrice || item.basePrice,
            quantity: 1,
            image: item.image,
            mealType: item.mealType as "BREAKFAST" | "LUNCH" | "DINNER",
            date: date,
          });
        }
      });
    });
    router.push("/checkout");
  };

  const mealTypeLabels: Record<string, { label: string; emoji: string }> = {
    BREAKFAST: { label: "Breakfast", emoji: "☀️" },
    LUNCH: { label: "Lunch", emoji: "🌤️" },
    DINNER: { label: "Dinner", emoji: "🌙" },
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <Badge className="bg-spice-100 text-spice-800 dark:bg-spice-900/30 dark:text-spice-400 border-none">
            <Calendar className="w-3 h-3 mr-1" /> Customize Your Meals
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Pick your <span className="gradient-text">daily meals</span>
          </h1>
          <p className="text-muted-foreground">
            Select 1 item per meal (included). Want more? Extra items will be charged at menu price.
          </p>
        </div>

        {/* Subscription Info Bar */}
        <div className="bg-secondary/50 border rounded-xl p-4 mb-6 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Period</div>
              <div className="font-medium">{format(startDate, "MMM d")} — {format(endDate, "MMM d, yyyy")}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Duration</div>
              <div className="font-medium">{duration} days</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Progress</div>
              <div className="font-medium">{completedDays}/{duration} days done</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Meals</div>
              <div className="font-medium">{meals.map((m) => mealTypeLabels[m]?.emoji).join(" ")}</div>
            </div>
          </div>
        </div>

        {/* Date Navigation — shows day dots */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(-1)}
              disabled={currentDate <= startDate}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center min-w-[180px]">
              <div className="font-heading font-bold text-lg">
                Day {currentDayIndex} — {currentDate.toLocaleDateString("en-IN", { weekday: "long" })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(1)}
              disabled={currentDate >= endDate}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day dots */}
          {duration <= 31 && (
            <div className="flex items-center justify-center gap-1 flex-wrap max-w-lg mx-auto">
              {Array.from({ length: duration }, (_, i) => {
                const d = addDays(startDate, i);
                const dk = format(d, "yyyy-MM-dd");
                const isCurrentDay = dk === dateKey;
                const hasSelections = meals.some((m) => (selectedItems[`${dk}-${m}`]?.length || 0) > 0);
                const allSelected = meals.every((m) => (selectedItems[`${dk}-${m}`]?.length || 0) > 0);
                return (
                  <button
                    key={dk}
                    onClick={() => setCurrentDate(d)}
                    className={`w-7 h-7 rounded-full text-[10px] font-medium transition-all ${
                      isCurrentDay
                        ? "bg-saffron-500 text-white shadow-md"
                        : allSelected
                          ? "bg-herb-500 text-white"
                          : hasSelections
                            ? "bg-saffron-200 dark:bg-saffron-800 text-saffron-700 dark:text-saffron-300"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                    title={format(d, "EEE, MMM d")}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Meal Sections */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500 mr-3" />
            Loading menu...
          </div>
        ) : (
          <div className="space-y-10">
            {meals.map((mealType) => {
              const items = filteredItems(mealType);
              const info = mealTypeLabels[mealType];
              const selected = getSelectedForMeal(mealType);
              const included = getIncludedCount(mealType);

              return (
                <div key={mealType}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                      <span>{info?.emoji}</span> {info?.label}
                    </h2>
                    <div className="flex items-center gap-2">
                      {selected.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {Math.min(selected.length, included)} included
                          {selected.length > included && (
                            <span className="text-spice-500 ml-1">
                              + {selected.length - included} extra
                            </span>
                          )}
                        </Badge>
                      )}
                      {selected.length === 0 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Pick {included} item{included > 1 ? "s" : ""} (included)
                        </Badge>
                      )}
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-xl">
                      <Info className="w-5 h-5 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No menu items available for {info?.label?.toLowerCase()} on this date.</p>
                      <p className="text-xs mt-1">Try navigating to another day.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map((item) => {
                        const itemSelected = isSelected(mealType, item.id);
                        const itemIncluded = isIncluded(mealType, item.id);
                        const price = item.specialPrice || item.basePrice;

                        return (
                          <Card
                            key={item.dailyMenuId}
                            className={`cursor-pointer transition-all duration-200 ${
                              itemSelected
                                ? itemIncluded
                                  ? "border-herb-400 shadow-lg shadow-herb-500/10 ring-1 ring-herb-400"
                                  : "border-saffron-400 shadow-lg shadow-saffron-500/10 ring-1 ring-saffron-400"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => toggleItem(mealType, item.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-2xl">{item.image}</div>
                                <div className="flex items-center gap-1.5">
                                  {itemSelected && itemIncluded && (
                                    <Badge className="bg-herb-500 text-white text-[9px] px-1.5 py-0">
                                      <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                      Included
                                    </Badge>
                                  )}
                                  {itemSelected && !itemIncluded && (
                                    <Badge className="bg-saffron-500 text-white text-[9px] px-1.5 py-0">
                                      <IndianRupee className="w-2.5 h-2.5 mr-0.5" />
                                      Extra
                                    </Badge>
                                  )}
                                  {itemSelected ? (
                                    <div className={`w-6 h-6 ${itemIncluded ? "bg-herb-500" : "bg-saffron-500"} rounded-full flex items-center justify-center`}>
                                      <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 border-2 border-muted-foreground/20 rounded-full flex items-center justify-center">
                                      <Plus className="w-3.5 h-3.5 text-muted-foreground/40" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h3 className="font-heading font-semibold text-sm mb-1">{item.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px]">
                                  {item.dietaryType === "VEG"
                                    ? "🟢 Veg"
                                    : item.dietaryType === "NON_VEG"
                                      ? "🔴 Non-Veg"
                                      : item.dietaryType === "VEGAN"
                                        ? "🌱 Vegan"
                                        : "🟡 Egg"}
                                </Badge>
                                <span className="text-sm font-bold ml-auto">
                                  {itemSelected && itemIncluded ? (
                                    <span className="text-herb-600">Free</span>
                                  ) : (
                                    <span className={itemSelected && !itemIncluded ? "text-saffron-600" : ""}>
                                      ₹{price}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Summary Bar */}
        {totalSelected > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t p-4 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="font-heading font-bold">{includedCount} included</span>
                  {extraCount > 0 && (
                    <span className="text-saffron-600 font-bold ml-2">
                      + {extraCount} extras (₹{extraCost})
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedDays}/{duration} days
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedItems({})}>
                  Clear
                </Button>
                <Button variant="gradient" className="gap-2" onClick={addAllToCart}>
                  <ShoppingCart className="w-4 h-4" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" />
        </div>
      }
    >
      <CustomizeContent />
    </Suspense>
  );
}
