import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        }
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Order History</h1>
        <p className="text-muted-foreground">View and manage all your past orders.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-20 bg-secondary/30 border-dashed">
          <CardContent>
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Once you order food, your history will appear here.
            </p>
            <Link href="/menu">
              <Button variant="gradient">Order Food</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-secondary/40 border-b px-6 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Order Placed</p>
                    <p className="font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground"/> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Total</p>
                    <p className="font-medium">₹{order.finalAmount}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Dispatch To</p>
                    <p className="font-medium flex items-center gap-1.5 line-clamp-1 max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground"/> {order.address?.fullName || "Saved Address"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs text-muted-foreground">Order # <span className="font-medium text-foreground">{order.orderNumber}</span></p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-saffron-600 dark:text-saffron-500 font-semibold flex items-center gap-1">
                    <ReceiptText className="w-3.5 h-3.5" />
                    Invoice
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-between">
                  {/* Left: Items */}
                  <div className="flex-1 space-y-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Badge 
                        variant={order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "outline" : "secondary"}
                        className={order.status === "DELIVERED" ? "bg-green-500" : ""}
                      >
                        {order.status}
                      </Badge>
                    </h4>
                    
                    <div className="space-y-3 pl-2">
                      {order.orderItems.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-secondary/80 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {item.menuItem.image || "🥘"}
                          </div>
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{item.menuItem.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Qty: {item.quantity} × ₹{item.unitPrice} • {item.mealType || "Standard"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right: Actions */}
                  <div className="flex flex-col gap-3 min-w-[200px] border-l sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 mt-4 sm:mt-0">
                    <div className="text-sm space-y-2 mb-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Items Total</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax & Delivery</span>
                        <span>₹{order.taxAmount + order.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between font-bold text-foreground border-t pt-2">
                        <span>Paid</span>
                        <span>₹{order.finalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
