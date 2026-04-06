import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CalendarCheck, 
  MapPin, 
  User as UserIcon,
  CreditCard
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Plans", href: "/plans", icon: CalendarCheck },
    { name: "Gift Cards", href: "/dashboard/gift-cards", icon: CreditCard },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-secondary/20 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border shadow-sm p-4 sticky top-28">
              <div className="flex items-center gap-3 mb-6 p-2">
                <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center text-xl shadow-inner font-bold text-saffron-700">
                  {session.user.name?.[0] || <UserIcon />}
                </div>
                <div>
                  <h3 className="font-bold font-heading line-clamp-1">{session.user.name || "Foodie"}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {(session.user as any).phone || session.user.email}
                  </p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
