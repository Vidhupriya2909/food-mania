// ============================================
// Food Mart - Type Definitions
// ============================================

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
export type DietaryType = "VEG" | "NON_VEG" | "VEGAN" | "EGGETARIAN";
export type SpiceLevel = "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
export type SubscriptionType = "DAILY" | "WEEKLY" | "MONTHLY";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED" | "PENDING";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type CouponType = "PERCENTAGE" | "FLAT" | "FREE_MEAL";
export type GiftCardStatus = "ACTIVE" | "PARTIALLY_USED" | "FULLY_REDEEMED" | "EXPIRED" | "CANCELLED";
export type DeliveryTrackingStatus = "PREPARING" | "PICKED_UP" | "IN_TRANSIT" | "NEAR_DELIVERY" | "DELIVERED" | "FAILED";

// ============================================
// Menu Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  basePrice: number;
  categoryId: string;
  category?: Category;
  dietaryType: DietaryType;
  allergens: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  isGlutenFree: boolean;
  isJainFriendly: boolean;
  spiceLevel: SpiceLevel;
  preparationTime?: number;
  servingSize?: string;
  isActive: boolean;
}

export interface DailyMenuItem {
  id: string;
  date: string;
  mealType: MealType;
  menuItemId: string;
  menuItem: MenuItem;
  isAvailable: boolean;
  specialPrice?: number;
  sortOrder: number;
}

// ============================================
// Subscription Types
// ============================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: SubscriptionType;
  durationDays: number;
  discountPercent: number;
  description?: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  mealTypes: MealType[];
  totalAmount: number;
  isRecurring: boolean;
  autoRenew: boolean;
  pausedAt?: string;
  resumeDate?: string;
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  deliveryCharge: number;
  finalAmount: number;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  mealType?: MealType;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  mealType: MealType;
  date?: string;
  specialPrice?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  couponCode?: string;
  giftCardCode?: string;
  giftCardAmount: number;
}

// ============================================
// Address Types
// ============================================

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

// ============================================
// Delivery Types
// ============================================

export interface DeliverySlot {
  id: string;
  mealType: MealType;
  startTime: string;
  endTime: string;
  label: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  pincodes: string[];
  city: string;
  state: string;
  isActive: boolean;
  deliveryCharge: number;
  freeDeliveryAbove?: number;
}

export interface DeliveryTracking {
  id: string;
  status: DeliveryTrackingStatus;
  deliveryPartner?: string;
  partnerPhone?: string;
  estimatedTime?: string;
  actualDeliveryTime?: string;
}

// ============================================
// Coupon & Gift Card Types
// ============================================

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit: number;
  usedCount: number;
  validFrom: string;
  validTill: string;
  description?: string;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  status: GiftCardStatus;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  designTemplate: string;
  expiresAt: string;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  role: "USER" | "ADMIN";
  referralCode: string;
  walletBalance: number;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Filter Types
// ============================================

export interface MenuFilters {
  mealType?: MealType;
  dietaryType?: DietaryType[];
  isGlutenFree?: boolean;
  isJainFriendly?: boolean;
  spiceLevel?: SpiceLevel[];
  categoryId?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  date?: string;
}
