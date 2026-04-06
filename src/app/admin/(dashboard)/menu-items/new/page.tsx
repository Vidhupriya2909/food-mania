import prisma from "@/lib/prisma";
import MenuItemForm from "../MenuItemForm";
import { createMenuItem } from "../actions";

export default async function NewMenuItemPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <MenuItemForm
      categories={categories}
      action={createMenuItem}
      title="Add New Menu Item"
      submitLabel="Create Item"
    />
  );
}
