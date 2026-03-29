"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function Home() {
    const user = useAppSelector(currentUser);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p className="text-gray-500 animate-pulse">Redirecting...</p>
        </div>
    );
}
