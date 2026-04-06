"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

type Category = { id: string; name: string };

interface MenuItemFormProps {
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string;
    basePrice: number;
    categoryId: string;
    dietaryType: string;
    spiceLevel: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    fiber: number | null;
    image: string | null;
    servingSize: string | null;
    preparationTime: number | null;
    isActive: boolean;
    isGlutenFree: boolean;
    isJainFriendly: boolean;
    allergens: string[];
  };
  title: string;
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="gradient" className="gap-2" disabled={pending}>
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {pending ? "Saving..." : label}
    </Button>
  );
}

export default function MenuItemForm({
  categories,
  action,
  defaultValues,
  title,
  submitLabel,
}: MenuItemFormProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/menu-items">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details below
          </p>
        </div>
      </div>

      <form action={action} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Paneer Butter Masala"
                defaultValue={defaultValues?.name}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                placeholder="A short description of this dish..."
                defaultValue={defaultValues?.description}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹) *</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 149.00"
                defaultValue={defaultValues?.basePrice}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={defaultValues?.categoryId}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="text"
                placeholder="https://example.com/image.jpg or emoji 🥘"
                defaultValue={defaultValues?.image || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servingSize">Serving Size</Label>
              <Input
                id="servingSize"
                name="servingSize"
                placeholder="e.g. 1 plate, 250ml"
                defaultValue={defaultValues?.servingSize || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dietary & Spice */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dietaryType">Dietary Type *</Label>
              <select
                id="dietaryType"
                name="dietaryType"
                required
                defaultValue={defaultValues?.dietaryType || "VEG"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
              >
                <option value="VEG">🟢 Vegetarian</option>
                <option value="NON_VEG">🔴 Non-Vegetarian</option>
                <option value="VEGAN">🌱 Vegan</option>
                <option value="EGGETARIAN">🟡 Eggetarian</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spiceLevel">Spice Level *</Label>
              <select
                id="spiceLevel"
                name="spiceLevel"
                required
                defaultValue={defaultValues?.spiceLevel || "MEDIUM"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
              >
                <option value="MILD">🌶️ Mild</option>
                <option value="MEDIUM">🌶️🌶️ Medium</option>
                <option value="HOT">🌶️🌶️🌶️ Hot</option>
                <option value="EXTRA_HOT">🔥 Extra Hot</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens</Label>
              <Input
                id="allergens"
                name="allergens"
                placeholder="e.g. nuts, dairy, gluten (comma separated)"
                defaultValue={defaultValues?.allergens?.join(", ") || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparationTime">Prep Time (minutes)</Label>
              <Input
                id="preparationTime"
                name="preparationTime"
                type="number"
                min="0"
                placeholder="e.g. 30"
                defaultValue={defaultValues?.preparationTime ?? ""}
              />
            </div>

            {/* Toggles */}
            <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={defaultValues?.isActive ?? true}
                  className="w-4 h-4 rounded border-input"
                />
                <span className="text-sm">Active (visible to users)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  value="true"
                  defaultChecked={defaultValues?.isGlutenFree ?? false}
                  className="w-4 h-4 rounded border-input"
                />
                <span className="text-sm">Gluten Free</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isJainFriendly"
                  value="true"
                  defaultChecked={defaultValues?.isJainFriendly ?? false}
                  className="w-4 h-4 rounded border-input"
                />
                <span className="text-sm">Jain Friendly</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Info (optional)</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                min="0"
                placeholder="e.g. 350"
                defaultValue={defaultValues?.calories ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 12.5"
                defaultValue={defaultValues?.protein ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 45.0"
                defaultValue={defaultValues?.carbs ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 8.0"
                defaultValue={defaultValues?.fat ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                name="fiber"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 3.2"
                defaultValue={defaultValues?.fiber ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/menu-items">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <SubmitButton label={submitLabel} />
        </div>
      </form>
    </div>
  );
}
