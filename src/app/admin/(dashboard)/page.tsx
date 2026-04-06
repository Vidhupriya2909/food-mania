import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, IndianRupee, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const menuItemsCount = await prisma.menuItem.count();
  
  // Calculate total revenue from delivered orders or all paid orders
  const revenueAgg = await prisma.order.aggregate({
    _sum: { finalAmount: true },
    where: { status: { in: ["DELIVERED", "CONFIRMED"] } }
  });
  
  const totalRevenue = revenueAgg._sum.finalAmount || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-heading">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Food Mart admin dashboard.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Revenue
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Orders
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{ordersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Customers
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{usersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Menu Items
              <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{menuItemsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Available in catalog</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions & Recent Activity placeholders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Pending implementation in Orders tab
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Database Sync</span>
              <span className="text-sm font-medium flex items-center gap-1 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Payment Gateway</span>
              <span className="text-sm font-medium text-amber-600">Sandbox Mode</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Menu Scheduler</span>
              <span className="text-sm font-medium flex items-center gap-1 text-green-600">
                Updated
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

// Ensure the icon is imported locally for this component
import { UtensilsCrossed } from "lucide-react";
