import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteMenuItemButton } from "./DeleteButton";

export default async function AdminMenuItemsPage() {
  const items = await prisma.menuItem.findMany({
    include: {
      category: true,
      _count: {
        select: { dailyMenuItems: true, orderItems: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Menu Items Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage the global database of all available foods.</p>
        </div>
        <Link href="/admin/menu-items/new">
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" /> Add New Item
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price (Base)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No menu items found. Click &quot;Add New Item&quot; to get started.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-xl">
                        {item.image || "🥘"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground flex gap-1 mt-0.5">
                        {item.dietaryType === "VEG" && <span className="text-green-600 font-medium">Veg</span>}
                        {item.dietaryType === "NON_VEG" && <span className="text-red-500 font-medium">Non-Veg</span>}
                        {item.dietaryType === "VEGAN" && <span className="text-emerald-600 font-medium">Vegan</span>}
                        {item.dietaryType === "EGGETARIAN" && <span className="text-yellow-600 font-medium">Egg</span>}
                        • {item.calories || "?"} kcal
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category.name}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{item.basePrice}
                    </TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div><span className="font-medium text-foreground">{item._count.orderItems}</span> ordered</div>
                        <div><span className="font-medium text-foreground">{item._count.dailyMenuItems}</span> schedules</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/menu-items/${item.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteMenuItemButton id={item.id} name={item.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
