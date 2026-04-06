import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Briefcase, Building } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  const labelIcons: Record<string, React.ReactNode> = {
    Home: <Home className="w-4 h-4" />,
    Work: <Briefcase className="w-4 h-4" />,
    Other: <Building className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">My Addresses</h1>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No saved addresses yet.</p>
            <p className="text-sm mt-1">Addresses you add during checkout will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-saffron-300 dark:border-saffron-700" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                      {labelIcons[address.label] || <MapPin className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-heading font-semibold text-sm">{address.label}</span>
                      {address.isDefault && (
                        <Badge variant="outline" className="ml-2 text-[10px] text-saffron-600 border-saffron-300">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-muted-foreground">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-muted-foreground">{address.addressLine2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className="text-muted-foreground text-xs">Landmark: {address.landmark}</p>
                  )}
                  <p className="text-muted-foreground text-xs">Phone: {address.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
