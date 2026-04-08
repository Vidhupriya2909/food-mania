"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2, Check, X, Truck, ChefHat, Package, RotateCcw } from "lucide-react";
import { updateOrderStatus } from "./actions";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  CONFIRMED: { label: "Approve (Confirm)", icon: <Check className="w-4 h-4" />, className: "text-green-600" },
  PREPARING: { label: "Mark Preparing", icon: <ChefHat className="w-4 h-4" />, className: "text-blue-600" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: <Truck className="w-4 h-4" />, className: "text-orange-600" },
  DELIVERED: { label: "Mark Delivered", icon: <Package className="w-4 h-4" />, className: "text-green-700" },
  CANCELLED: { label: "Reject (Cancel)", icon: <X className="w-4 h-4" />, className: "text-red-600" },
  REFUNDED: { label: "Mark Refunded", icon: <RotateCcw className="w-4 h-4" />, className: "text-purple-600" },
};

export default function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleStatusChange = (newStatus: string) => {
    setError("");
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (e: any) {
        setError(e.message || "Failed to update");
      }
    });
  };

  // Don't show actions for terminal states
  if (currentStatus === "DELIVERED" || currentStatus === "REFUNDED") {
    return null;
  }

  const availableTransitions = Object.entries(statusConfig).filter(
    ([status]) => status !== currentStatus
  );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending} className="gap-1">
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Actions"}
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableTransitions.map(([status, config]) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`gap-2 cursor-pointer ${config.className}`}
            >
              {config.icon}
              {config.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
