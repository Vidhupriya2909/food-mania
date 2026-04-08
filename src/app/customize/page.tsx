"use client";

import React from "react";
import { redirect } from "next/navigation";

// Customize page is no longer part of the flow.
// Plans now go directly to checkout. Redirect to /plans.
export default function CustomizePage() {
  redirect("/plans");
}
