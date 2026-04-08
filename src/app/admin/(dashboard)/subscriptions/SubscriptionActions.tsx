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
import { ChevronDown, Loader2, Check, X, Pause, Play } from "lucide-react";
import { updateSubscriptionStatus } from "./actions";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  ACTIVE: { label: "Approve (Activate)", icon: <Check className="w-4 h-4" />, className: "text-green-600" },
  PAUSED: { label: "Pause", icon: <Pause className="w-4 h-4" />, className: "text-yellow-600" },
  CANCELLED: { label: "Reject (Cancel)", icon: <X className="w-4 h-4" />, className: "text-red-600" },
};

export default function SubscriptionActions({ subscriptionId, currentStatus }: { subscriptionId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleStatusChange = (newStatus: string) => {
    setError("");
    startTransition(async () => {
      try {
        await updateSubscriptionStatus(subscriptionId, newStatus);
      } catch (e: any) {
        setError(e.message || "Failed to update");
      }
    });
  };

  if (currentStatus === "EXPIRED") return null;

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
