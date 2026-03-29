"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = useAppSelector(currentUser);
    const router = useRouter();
    // Check if the store is hydrated (persisted data loaded)
    const isRehydrated = useAppSelector((state: any) => state.auth._persist?.rehydrated);

    useEffect(() => {
        // Wait until the store is rehydrated before checking user status
        if (isRehydrated && !user) {
            router.push("/login");
        }
    }, [user, router, isRehydrated]);

    // Show loading spinner while rehydrating or checking user
    if (!isRehydrated || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-gray-500">Verifying session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen p-8">{children}</main>
        </div>
    );
}
