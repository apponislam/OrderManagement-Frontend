"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useEffect } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const isRehydrated = useAppSelector((state: any) => state.auth._persist?.rehydrated);

    useEffect(() => {
        if (isRehydrated && user) {
            router.push("/dashboard");
        }
    }, [user, router, isRehydrated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setUser({ token: res.data.accessToken }));
            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Please check your credentials.");
        }
    };

    const handleDemoLogin = () => {
        setEmail("admin@example.com");
        setPassword("password123");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 px-4">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <LogIn className="text-white w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-gray-500">Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" className="h-11 shadow-sm border-gray-200 focus:border-blue-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" type="password" placeholder="••••••••" className="h-11 shadow-sm border-gray-200 focus:border-blue-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-4">
                        <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all font-semibold" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                        <Button type="button" variant="outline" className="w-full h-11 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all" onClick={handleDemoLogin}>
                            Demo Admin Login
                        </Button>
                        <p className="text-sm text-center text-gray-500 mt-2">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
