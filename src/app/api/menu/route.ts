import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    
    // Parse date as UTC to match DB-stored dates (which are at UTC midnight)
    let targetDate: Date;
    if (dateParam) {
      // "YYYY-MM-DD" → UTC midnight via Date.UTC
      const [y, m, d] = dateParam.split("-").map(Number);
      targetDate = new Date(Date.UTC(y, m - 1, d));
    } else {
      // Default to today in local timezone, but store as UTC midnight
      const now = new Date();
      targetDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    // Fetch DailyMenu for the target date, including the MenuItem details
    const dailyMenuItems = await prisma.dailyMenu.findMany({
      where: {
        date: targetDate,
        isAvailable: true,
      },
      include: {
        menuItem: {
          include: {
            category: true,
          }
        },
      },
      orderBy: [
        { mealType: 'asc' },
        { sortOrder: 'asc' }
      ]
    });

    // Format the response to make it easy for the frontend to consume
    const formattedMenu = dailyMenuItems.map((item: any) => ({
      ...item.menuItem,
      id: item.menuItem.id,
      dailyMenuId: item.id,
      mealType: item.mealType,
      categoryName: item.menuItem.category.name,
      specialPrice: item.specialPrice,
    }));

    return NextResponse.json({ success: true, data: formattedMenu });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
