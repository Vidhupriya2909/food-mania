import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      orderItems: { include: { menuItem: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit to recent 50 for admin overview
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Global Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track all platform orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">{format(new Date(order.createdAt), "MMM d, yyyy")}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "h:mm a")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{order.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm" title={order.orderItems.map((i: any) => i.menuItem.name).join(", ")}>
                        {order.orderItems.length} items
                        <span className="text-muted-foreground ml-1">
                          ({order.orderItems.map((i: any) => i.menuItem.name).join(", ")})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₹{order.finalAmount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "outline" : "secondary"}
                        className={order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {order.status}
                      </Badge>
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
