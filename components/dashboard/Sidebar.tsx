"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Tags, 
    AlertCircle, 
    LogOut,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logOut, currentUser } from "@/redux/features/auth/authSlice";
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
    const user = useAppSelector(currentUser);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            dispatch(logOut());
            router.push("/login");
        }
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 shadow-sm">
            <div className="flex items-center px-6 h-20 border-b border-gray-50">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <Package className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SmartInv
                </span>
            </div>
            
            <div className="px-6 py-6 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate capitalize">
                            {user?.role || "Role"}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                isActive 
                                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn(
                                "mr-3 h-5 w-5 transition-colors",
                                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl py-6 transition-all duration-200"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </Button>
            </div>
        </div>
    );
}
