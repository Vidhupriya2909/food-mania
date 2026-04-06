import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MenuItemForm from "../../MenuItemForm";
import { updateMenuItem } from "../../actions";

interface EditMenuItemPageProps {
  params: { id: string };
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!item) {
    notFound();
  }

  const updateAction = updateMenuItem.bind(null, item.id);

  return (
    <MenuItemForm
      categories={categories}
      action={updateAction}
      defaultValues={{
        name: item.name,
        description: item.description,
        basePrice: item.basePrice,
        categoryId: item.categoryId,
        dietaryType: item.dietaryType,
        spiceLevel: item.spiceLevel,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        image: item.image,
        servingSize: item.servingSize,
        preparationTime: item.preparationTime,
        isActive: item.isActive,
        isGlutenFree: item.isGlutenFree,
        isJainFriendly: item.isJainFriendly,
        allergens: item.allergens,
      }}
      title={`Edit: ${item.name}`}
      submitLabel="Save Changes"
    />
  );
}
