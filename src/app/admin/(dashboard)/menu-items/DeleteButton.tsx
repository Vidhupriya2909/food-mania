"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMenuItem } from "./actions";
import { useState } from "react";

interface DeleteMenuItemButtonProps {
  id: string;
  name: string;
}

export function DeleteMenuItemButton({ id, name }: DeleteMenuItemButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nIf this item has order history, it will be marked inactive instead of deleted.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteMenuItem(id);
    } catch (error) {
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
