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
import SubscriptionActions from "./SubscriptionActions";

const statusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "PENDING":
      return <Badge variant="outline">{status}</Badge>;
    case "PAUSED":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">{status}</Badge>;
    case "EXPIRED":
      return <Badge variant="secondary">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage and approve/reject customer subscriptions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions ({subscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Meals</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-medium">{sub.user.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{sub.user.phone || sub.user.email}</div>
                    </TableCell>
                    <TableCell className="font-medium">{sub.plan?.name || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {(sub.mealTypes as string[])?.join(", ") || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{format(new Date(sub.startDate), "MMM d")}</div>
                      <div className="text-xs text-muted-foreground">
                        to {format(new Date(sub.endDate), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₹{sub.totalAmount}</TableCell>
                    <TableCell>{statusBadge(sub.status)}</TableCell>
                    <TableCell className="text-right">
                      <SubscriptionActions subscriptionId={sub.id} currentStatus={sub.status} />
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
