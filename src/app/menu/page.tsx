"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  Zap,
  Leaf,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const DIETARY_FILTERS = [
  { value: "VEG", label: "🟢 Vegetarian", color: "veg" },
  { value: "NON_VEG", label: "🔴 Non-Veg", color: "nonveg" },
  { value: "VEGAN", label: "🌿 Vegan", color: "vegan" },
  { value: "EGGETARIAN", label: "🟡 Eggetarian", color: "egg" },
];

const SPICE_FILTERS = [
  { value: "MILD", label: "🌶️ Mild" },
  { value: "MEDIUM", label: "🌶️🌶️ Medium" },
  { value: "HOT", label: "🌶️🌶️🌶️ Hot" },
  { value: "EXTRA_HOT", label: "🌶️🌶️🌶️🌶️ Extra Hot" },
];

export default function MenuPage() {
  const [activeMeal, setActiveMeal] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string[]>([]);
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(false);
  const [jainOnly, setJainOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { addToCart } = useCart();
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        const response = await fetch(`/api/menu?date=${dateStr}`);
        const result = await response.json();
        if (result.success) {
          setMenuItems(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [selectedDate]);

  const filteredMenu = useMemo(() => {
    let items = menuItems;

    if (activeMeal !== "all") {
      items = items.filter((item) => item.mealType.toLowerCase() === activeMeal);
    }

    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDietary.length > 0) {
      items = items.filter((item) => selectedDietary.includes(item.dietaryType));
    }

    if (selectedSpice.length > 0) {
      items = items.filter((item) => selectedSpice.includes(item.spiceLevel));
    }

    if (glutenFreeOnly) {
      items = items.filter((item) => item.isGlutenFree);
    }

    if (jainOnly) {
      items = items.filter((item) => item.isJainFriendly);
    }

    return items;
  }, [menuItems, activeMeal, searchQuery, selectedDietary, selectedSpice, glutenFreeOnly, jainOnly]);

  const toggleDietary = (value: string) => {
    setSelectedDietary((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSpice = (value: string) => {
    setSelectedSpice((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedDietary([]);
    setSelectedSpice([]);
    setGlutenFreeOnly(false);
    setJainOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedDietary.length + selectedSpice.length + (glutenFreeOnly ? 1 : 0) + (jainOnly ? 1 : 0);

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((compareDate.getTime() - today.getTime()) / (86400000));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-enter" id="menu-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <Badge className="bg-spice-100 text-spice-800 dark:bg-spice-900/30 dark:text-spice-400 border-none">
              Daily Menu
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Today&apos;s <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Freshly prepared by our expert chefs. New items every day — browse, filter, and add to your subscription.
          </p>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(-1)}
            id="menu-date-prev"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border">
            <span className="text-lg">📅</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
            <span className="text-sm text-muted-foreground">
              {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(1)}
            id="menu-date-next"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search meals, cuisines, ingredients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="menu-search"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
            id="menu-filter-toggle"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="bg-saffron-500 text-white border-none h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6 animate-fade-in">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
                    <X className="w-3 h-3" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Dietary Type */}
                <div>
                  <p className="text-sm font-medium mb-2">Dietary Preference</p>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_FILTERS.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedDietary.includes(filter.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDietary(filter.value)}
                        className="text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <p className="text-sm font-medium mb-2">Spice Level</p>
                  <div className="flex flex-wrap gap-2">
                    {SPICE_FILTERS.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedSpice.includes(filter.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSpice(filter.value)}
                        className="text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <p className="text-sm font-medium mb-2">Special</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={glutenFreeOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGlutenFreeOnly(!glutenFreeOnly)}
                      className="text-xs"
                    >
                      🌾 Gluten Free
                    </Button>
                    <Button
                      variant={jainOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setJainOnly(!jainOnly)}
                      className="text-xs"
                    >
                      🙏 Jain Friendly
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meal Type Tabs */}
        <Tabs defaultValue="all" value={activeMeal} onValueChange={setActiveMeal} className="mb-8">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex gap-1 h-auto p-1">
            <TabsTrigger value="all" className="gap-1.5 py-2">
              🍽️ All
            </TabsTrigger>
            <TabsTrigger value="breakfast" className="gap-1.5 py-2">
              ☀️ Breakfast
            </TabsTrigger>
            <TabsTrigger value="lunch" className="gap-1.5 py-2">
              🌤️ Lunch
            </TabsTrigger>
            <TabsTrigger value="dinner" className="gap-1.5 py-2">
              🌙 Dinner
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeMeal} className="mt-6">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{filteredMenu.length}</strong> items
              </p>
            </div>

            {/* Menu Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-saffron-500 mb-4" />
                <p>Curating today&apos;s masterpieces...</p>
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-heading font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMenu.map((item, index) => (
                  <Card
                    key={item.id}
                    className="card-hover overflow-hidden group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-0">
                      {/* Food Display */}
                      <div className="relative p-4 pb-2">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant={
                              item.dietaryType === "VEG" ? "veg" :
                              item.dietaryType === "NON_VEG" ? "nonveg" :
                              item.dietaryType === "VEGAN" ? "vegan" : "egg"
                            }
                            className="text-[10px]"
                          >
                            {item.dietaryType === "VEG" ? "🟢 Veg" :
                             item.dietaryType === "NON_VEG" ? "🔴 Non-Veg" :
                             item.dietaryType === "VEGAN" ? "🌿 Vegan" : "🟡 Egg"}
                          </Badge>
                          {item.isGlutenFree && (
                            <Badge variant="outline" className="text-[10px]">GF</Badge>
                          )}
                        </div>

                        <div className="text-5xl text-center py-2 group-hover:scale-110 transition-transform duration-300">
                          {item.image || "🥘"}
                        </div>

                        <h3 className="text-sm font-bold font-heading mt-2">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Zap className="w-3 h-3" /> {item.calories} cal
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {item.preparationTime}m
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-3 h-3" />
                            {item.spiceLevel === "MILD" ? "Mild" :
                             item.spiceLevel === "MEDIUM" ? "Med" :
                             item.spiceLevel === "HOT" ? "Hot" : "🔥"}
                          </span>
                        </div>
                      </div>

                      {/* Price + Add */}
                      <div className="px-4 py-3 bg-secondary/30 flex items-center justify-between border-t">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold font-heading">
                            ₹{item.specialPrice || item.basePrice}
                          </span>
                          {item.specialPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{item.basePrice}</span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="gradient" 
                          className="h-8 text-xs gap-1"
                          onClick={() => addToCart({
                            dailyMenuId: item.dailyMenuId,
                            menuItemId: item.id,
                            name: item.name,
                            price: item.specialPrice || item.basePrice,
                            quantity: 1,
                            image: item.image || "🥘",
                            mealType: item.mealType,
                            date: selectedDate.toISOString(),
                          })}
                        >
                          Add <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
