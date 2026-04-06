"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { addToDailyMenu, removeFromDailyMenu, toggleAvailability } from "./actions";

type MenuItem = {
  id: string;
  name: string;
  image: string | null;
  basePrice: number;
  dietaryType: string;
  category: { name: string };
};

interface ScheduleItemDialogProps {
  menuItems: MenuItem[];
  targetDate: string;
  defaultMealType?: string;
}

export function ScheduleItemDialog({ menuItems, targetDate, defaultMealType }: ScheduleItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState(defaultMealType || "BREAKFAST");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [specialPrice, setSpecialPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("menuItemId", selectedItem);
      formData.set("mealType", selectedMealType);
      formData.set("date", targetDate);
      if (specialPrice) formData.set("specialPrice", specialPrice);

      await addToDailyMenu(formData);
      setOpen(false);
      setSelectedItem(null);
      setSpecialPrice("");
      setSearch("");
    } catch (e: any) {
      setError(e.message || "Failed to schedule item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Schedule Item for {new Date(targetDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Meal Type Selection */}
          <div className="space-y-2">
            <Label>Meal Type</Label>
            <div className="flex gap-2">
              {["BREAKFAST", "LUNCH", "DINNER"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedMealType === type
                      ? "bg-saffron-500 text-white"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type === "BREAKFAST" ? "☀️" : type === "LUNCH" ? "🌤️" : "🌙"} {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Items List */}
          <div className="flex-1 overflow-y-auto border rounded-lg divide-y max-h-[300px]">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No items found</div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                  className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                    selectedItem === item.id
                      ? "bg-saffron-50 dark:bg-saffron-900/20"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-lg flex-shrink-0">
                    {item.image || "🥘"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground flex gap-1.5">
                      <span>{item.category.name}</span>
                      <span>•</span>
                      <span>₹{item.basePrice}</span>
                      <span>•</span>
                      <span className={item.dietaryType === "VEG" ? "text-green-600" : item.dietaryType === "NON_VEG" ? "text-red-500" : "text-emerald-600"}>
                        {item.dietaryType === "VEG" ? "Veg" : item.dietaryType === "NON_VEG" ? "Non-Veg" : item.dietaryType === "VEGAN" ? "Vegan" : "Egg"}
                      </span>
                    </div>
                  </div>
                  {selectedItem === item.id && (
                    <div className="w-5 h-5 rounded-full bg-saffron-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Special Price */}
          {selectedItem && (
            <div className="space-y-2">
              <Label htmlFor="specialPrice">Special Price (optional)</Label>
              <Input
                id="specialPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Leave empty to use base price"
                value={specialPrice}
                onChange={(e) => setSpecialPrice(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Submit */}
          <Button
            variant="gradient"
            className="w-full gap-2"
            disabled={!selectedItem || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isSubmitting ? "Scheduling..." : "Add to Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface RemoveItemButtonProps {
  dailyMenuId: string;
  itemName: string;
}

export function RemoveItemButton({ dailyMenuId, itemName }: RemoveItemButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    const confirmed = window.confirm(`Remove "${itemName}" from this day's schedule?`);
    if (!confirmed) return;

    setIsRemoving(true);
    try {
      await removeFromDailyMenu(dailyMenuId);
    } catch {
      alert("Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      onClick={handleRemove}
      disabled={isRemoving}
    >
      {isRemoving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </Button>
  );
}

interface ToggleAvailabilityButtonProps {
  dailyMenuId: string;
  isAvailable: boolean;
}

export function ToggleAvailabilityButton({ dailyMenuId, isAvailable }: ToggleAvailabilityButtonProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleAvailability(dailyMenuId, !isAvailable);
    } catch {
      alert("Failed to update availability");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-7 w-7 ${isAvailable ? "text-herb-500 hover:text-herb-700" : "text-muted-foreground hover:text-foreground"}`}
      onClick={handleToggle}
      disabled={isToggling}
      title={isAvailable ? "Mark as sold out" : "Mark as available"}
    >
      {isToggling ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isAvailable ? (
        <Eye className="w-3.5 h-3.5" />
      ) : (
        <EyeOff className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
