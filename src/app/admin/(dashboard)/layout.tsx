import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  BarChart3,
  Users,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  // Verify Admin Role in DB
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, phone: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Menu Scheduler", href: "/admin/scheduler", icon: CalendarDays },
    { name: "Items & Categories", href: "/admin/menu-items", icon: UtensilsCrossed },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-card page-enter flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r hidden lg:block h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 text-saffron-600 mb-8 border-b pb-4">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold font-heading uppercase tracking-wider text-sm">Admin Portal</span>
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin info at bottom */}
          <div className="border-t pt-4 mt-4">
            <div className="text-xs text-muted-foreground mb-1">Signed in as</div>
            <div className="text-sm font-medium truncate">{dbUser.name || dbUser.phone || "Admin"}</div>
          </div>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-[calc(100vh-6rem)] bg-secondary/20">
        {children}
      </main>
    </div>
  );
}
