"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User, Phone, Mail, Calendar, Pencil, Save, X, Loader2, Check, Camera,
} from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
    image: string | null;
    createdAt: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const { update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [image, setImage] = useState<string | null>(initialData.image);
  const [imageChanged, setImageChanged] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 500_000) {
      setError("Image must be under 500KB. Try a smaller image or compress it.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImage(dataUrl);
      setImageChanged(true);
      setError("");
      if (!isEditing) setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageChanged(true);
    if (!isEditing) setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSaved(false);

    try {
      const payload: any = { name, email };
      if (imageChanged) payload.image = image;

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      // Trigger NextAuth session refresh so Navbar picks up changes
      await updateSession();

      setIsEditing(false);
      setImageChanged(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(initialData.name);
    setEmail(initialData.email);
    setImage(initialData.image);
    setImageChanged(false);
    setIsEditing(false);
    setError("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-saffron-500" />
          Personal Information
        </CardTitle>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-herb-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          {!isEditing ? (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setIsEditing(true)}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </Button>
              <Button variant="gradient" size="sm" className="gap-1.5" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-saffron-200 dark:border-saffron-800 bg-saffron-50 dark:bg-saffron-950/30 flex items-center justify-center">
              {image ? (
                <Image
                  src={image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-saffron-600 font-heading">
                  {name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-saffron-500 hover:bg-saffron-600 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{name || "Add your name"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click the camera icon to upload a photo
            </p>
            {image && (
              <button
                onClick={handleRemoveImage}
                className="text-xs text-red-500 hover:text-red-600 mt-1 underline"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
            {isEditing ? (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-9"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{name || "Not set"}</span>
              </div>
            )}
          </div>

          {/* Phone (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{initialData.phone || "Not set"}</span>
              {initialData.phoneVerified && (
                <Badge variant="outline" className="ml-auto text-herb-600 border-herb-300 text-[10px]">
                  Verified
                </Badge>
              )}
            </div>
            {isEditing && (
              <p className="text-[10px] text-muted-foreground">Phone number can&apos;t be changed. Contact support if needed.</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
            {isEditing ? (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-9"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{email || "Not set"}</span>
              </div>
            )}
          </div>

          {/* Member Since (always read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Member Since</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {new Date(initialData.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
