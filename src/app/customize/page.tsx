"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

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
  const planId = searchParams.get("plan");
  const meals = searchParams.get("meals")?.split(",") || ["BREAKFAST", "LUNCH", "DINNER"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  const dateKey = currentDate.toISOString().split("T")[0];

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/menu?date=${currentDate.toISOString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMenuItems(data.menu);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentDate]);

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
    const key = `${dateKey}-${mealType}`;
    return (selectedItems[key] || []).includes(itemId);
  };

  const filteredItems = (mealType: string) =>
    menuItems.filter((item) => item.mealType === mealType);

  const navigateDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    if (newDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setCurrentDate(newDate);
    }
  };

  const totalSelected = Object.values(selectedItems).flat().length;

  const addAllToCart = () => {
    Object.entries(selectedItems).forEach(([key, itemIds]) => {
      const [date, mealType] = key.split("-").length > 3
        ? [key.substring(0, 10), key.substring(11)]
        : key.split("-");
      itemIds.forEach((itemId) => {
        const item = menuItems.find((m) => m.id === itemId || m.dailyMenuId === itemId);
        if (item) {
          addToCart({
            dailyMenuId: item.dailyMenuId,
            menuItemId: item.id,
            name: item.name,
            price: item.specialPrice || item.basePrice,
            quantity: 1,
            image: item.image,
            mealType: item.mealType as "BREAKFAST" | "LUNCH" | "DINNER",
            date: date,
          });
        }
      });
    });
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
        <div className="text-center space-y-4 mb-8">
          <Badge className="bg-spice-100 text-spice-800 dark:bg-spice-900/30 dark:text-spice-400 border-none">
            <Calendar className="w-3 h-3 mr-1" /> Customize Your Meals
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Pick your <span className="gradient-text">daily meals</span>
          </h1>
          <p className="text-muted-foreground">
            Choose what you&apos;d like to eat each day. Navigate between dates and select your favorites.
          </p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <div className="font-heading font-bold text-lg">
              {currentDate.toLocaleDateString("en-IN", { weekday: "long" })}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
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
              if (items.length === 0) return null;
              return (
                <div key={mealType}>
                  <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                    <span>{info?.emoji}</span> {info?.label}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <Card
                        key={item.dailyMenuId}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected(mealType, item.id)
                            ? "border-saffron-400 shadow-lg shadow-saffron-500/10 ring-1 ring-saffron-400"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => toggleItem(mealType, item.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-2xl">{item.image}</div>
                            {isSelected(mealType, item.id) ? (
                              <div className="w-6 h-6 bg-saffron-500 rounded-full flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-muted-foreground/20 rounded-full flex items-center justify-center">
                                <Plus className="w-3.5 h-3.5 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-heading font-semibold text-sm mb-1">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {item.dietaryType === "VEG" ? "🟢 Veg" : item.dietaryType === "NON_VEG" ? "🔴 Non-Veg" : item.dietaryType === "VEGAN" ? "🌱 Vegan" : "🟡 Egg"}
                            </Badge>
                            <span className="text-sm font-bold ml-auto">
                              ₹{item.specialPrice || item.basePrice}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Cart Bar */}
        {totalSelected > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t p-4 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <span className="font-heading font-bold">{totalSelected} items</span>
                <span className="text-sm text-muted-foreground ml-2">selected</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedItems({})}>
                  Clear
                </Button>
                <Link href="/checkout">
                  <Button variant="gradient" className="gap-2" onClick={addAllToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart & Checkout
                  </Button>
                </Link>
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
    <Suspense fallback={
      <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" />
      </div>
    }>
      <CustomizeContent />
    </Suspense>
  );
}
