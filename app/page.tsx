"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function Home() {
    const user = useAppSelector(currentUser);
    const router = useRouter();
    const isRehydrated = useAppSelector((state: any) => state.auth._persist?.rehydrated);

    useEffect(() => {
        if (!isRehydrated) return; // Wait for hydration

        if (user) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [user, router, isRehydrated]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-gray-500 text-center animate-pulse">Redirecting...</p>
            </div>
        </div>
    );
}
