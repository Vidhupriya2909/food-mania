import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { ScheduleItemDialog, RemoveItemButton, ToggleAvailabilityButton } from "./SchedulerClient";

export default async function AdminSchedulerPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfWeek = addDays(today, 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const [dailyMenusRaw, allMenuItems] = await Promise.all([
    prisma.dailyMenu.findMany({
      where: {
        date: { gte: today, lte: endOfWeek },
      },
      include: { menuItem: true },
      orderBy: [{ date: "asc" }, { mealType: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.menuItem.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Group by date
  const scheduledDays: Record<string, typeof dailyMenusRaw> = {};
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    scheduledDays[format(d, "yyyy-MM-dd")] = [];
  }
  dailyMenusRaw.forEach((dm: any) => {
    const dateStr = format(new Date(dm.date), "yyyy-MM-dd");
    if (scheduledDays[dateStr]) {
      scheduledDays[dateStr].push(dm);
    }
  });

  const menuItemsForDialog = allMenuItems.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    basePrice: item.basePrice,
    dietaryType: item.dietaryType,
    category: item.category,
  }));

  const mealTypeOrder = ["BREAKFAST", "LUNCH", "DINNER"];
  const mealTypeInfo: Record<string, { label: string; emoji: string; color: string }> = {
    BREAKFAST: { label: "Breakfast", emoji: "☀️", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    LUNCH: { label: "Lunch", emoji: "🌤️", color: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400" },
    DINNER: { label: "Dinner", emoji: "🌙", color: "bg-spice-100 text-spice-700 dark:bg-spice-900/30 dark:text-spice-400" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Menu Scheduler</h1>
          <p className="text-muted-foreground mt-1">Plan and assign menu items to specific dates and meal times.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(scheduledDays).map(([dateStr, items]) => {
          const isToday = format(today, "yyyy-MM-dd") === dateStr;
          const displayDate = new Date(dateStr + "T00:00:00");

          // Group items by meal type
          const byMealType: Record<string, typeof items> = {};
          for (const mt of mealTypeOrder) {
            byMealType[mt] = items.filter((i: any) => i.mealType === mt);
          }

          return (
            <Card key={dateStr} className={isToday ? "border-saffron-400 ring-1 ring-saffron-400 shadow-md" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-4 bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isToday ? "bg-saffron-100 text-saffron-600" : "bg-card border"}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {isToday ? "Today" : format(displayDate, "EEEE")}
                      {" "}
                      <span className="text-muted-foreground font-normal text-sm ml-1">
                        {format(displayDate, "MMM d, yyyy")}
                      </span>
                    </CardTitle>
                    <CardDescription>{items.length} items scheduled</CardDescription>
                  </div>
                </div>
                <ScheduleItemDialog
                  menuItems={menuItemsForDialog}
                  targetDate={dateStr}
                />
              </CardHeader>

              <CardContent className="p-0">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm border-t border-dashed">
                    No items scheduled. Click &quot;Add Item&quot; to get started.
                  </div>
                ) : (
                  <div className="border-t">
                    {mealTypeOrder.map((mt) => {
                      const mealItems = byMealType[mt];
                      if (mealItems.length === 0) return null;
                      const info = mealTypeInfo[mt];

                      return (
                        <div key={mt}>
                          {/* Meal type header */}
                          <div className="px-4 py-2 bg-secondary/40 flex items-center justify-between border-b">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{info.emoji}</span>
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {info.label}
                              </span>
                              <Badge variant="outline" className="text-[10px] ml-1">
                                {mealItems.length}
                              </Badge>
                            </div>
                          </div>
                          {/* Items in this meal */}
                          <div className="divide-y">
                            {mealItems.map((item: any) => (
                              <div key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                    {item.menuItem.image || "🥘"}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{item.menuItem.name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {item.specialPrice && (
                                        <span className="text-xs text-saffron-600 font-medium">
                                          Special: ₹{item.specialPrice}
                                          <span className="line-through text-muted-foreground ml-1">₹{item.menuItem.basePrice}</span>
                                        </span>
                                      )}
                                      {!item.specialPrice && (
                                        <span className="text-xs text-muted-foreground">₹{item.menuItem.basePrice}</span>
                                      )}
                                      {!item.isAvailable && (
                                        <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                          Sold Out
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ToggleAvailabilityButton dailyMenuId={item.id} isAvailable={item.isAvailable} />
                                  <RemoveItemButton dailyMenuId={item.id} itemName={item.menuItem.name} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
