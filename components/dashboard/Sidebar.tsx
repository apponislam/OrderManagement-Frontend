"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Tags, AlertCircle, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Categories", href: "/dashboard/categories", icon: Tags },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Restock Queue", href: "/dashboard/restock-queue", icon: AlertCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logOut());
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r">
            <div className="flex items-center justify-between h-16 px-6 border-b">
                <span className="text-xl font-bold text-primary">Smart Inventory</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} className={cn("flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100")}>
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
