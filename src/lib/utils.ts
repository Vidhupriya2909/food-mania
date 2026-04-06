import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const prefix = "FM";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateOtp(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "FM";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getMealTypeColor(mealType: string): string {
  switch (mealType) {
    case "BREAKFAST":
      return "text-amber-500";
    case "LUNCH":
      return "text-saffron-500";
    case "DINNER":
      return "text-spice-500";
    default:
      return "text-muted-foreground";
  }
}

export function getMealTypeIcon(mealType: string): string {
  switch (mealType) {
    case "BREAKFAST":
      return "☀️";
    case "LUNCH":
      return "🌤️";
    case "DINNER":
      return "🌙";
    default:
      return "🍽️";
  }
}

export function getDietaryLabel(type: string): string {
  switch (type) {
    case "VEG":
      return "Vegetarian";
    case "NON_VEG":
      return "Non-Vegetarian";
    case "VEGAN":
      return "Vegan";
    case "EGGETARIAN":
      return "Eggetarian";
    default:
      return type;
  }
}

export function getDietaryColor(type: string): string {
  switch (type) {
    case "VEG":
      return "badge-veg";
    case "NON_VEG":
      return "badge-nonveg";
    case "VEGAN":
      return "badge-vegan";
    case "EGGETARIAN":
      return "badge-egg";
    default:
      return "";
  }
}

export function getSpiceLevelEmoji(level: string): string {
  switch (level) {
    case "MILD":
      return "🌶️";
    case "MEDIUM":
      return "🌶️🌶️";
    case "HOT":
      return "🌶️🌶️🌶️";
    case "EXTRA_HOT":
      return "🌶️🌶️🌶️🌶️";
    default:
      return "";
  }
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round(originalPrice * (discountPercent / 100));
}

export function calculateTax(amount: number, taxPercent: number): number {
  return Math.round(amount * (taxPercent / 100));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
