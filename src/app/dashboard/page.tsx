import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Clock, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Dashboard Overview</h1>
        <Link href="/menu">
          <Button variant="outline" size="sm" className="gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Order Now
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Stats Cards */}
        <Card className="bg-gradient-to-br from-saffron-50 to-white dark:from-saffron-950/20 dark:to-background border-saffron-100">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
            <h3 className="text-3xl font-bold font-heading mt-1">
              {(await prisma.order.count({ where: { userId: session.user.id } }))}
            </h3>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-spice-50 to-white dark:from-spice-950/20 dark:to-background border-spice-100">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-spice-100 text-spice-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
            <h3 className="text-3xl font-bold font-heading mt-1">
              {(await prisma.subscription.count({ where: { userId: session.user.id, status: "ACTIVE" } }))}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-primary">
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven&apos;t placed any orders yet.</p>
              <Link href="/menu" className="mt-4 inline-block">
                <Button variant="gradient">Explore Menu</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 sm:p-6 hover:bg-secondary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">Order #{order.orderNumber}</span>
                        <Badge 
                          variant={order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "outline" : "secondary"}
                          className={order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap text-sm">
                        {order.orderItems.map((item: any, i: number) => (
                          <span key={item.id} className="flex flex-wrap items-center">
                            <span className="font-medium mr-1">{item.quantity}x</span> {item.menuItem.name}
                            {i < order.orderItems.length - 1 && <span className="mx-2 text-muted-foreground">•</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-bold text-lg font-heading whitespace-nowrap">₹{order.finalAmount}</span>
                      <Button variant="outline" size="sm" className="mt-4 gap-1 h-8 text-xs">
                        Reorder <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
