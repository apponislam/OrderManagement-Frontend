"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useEffect } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [signup, { isLoading }] = useSignupMutation();
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const isRehydrated = useAppSelector((state: any) => state.auth._persist?.rehydrated);

    useEffect(() => {
        if (isRehydrated && user) {
            router.push("/dashboard");
        }
    }, [user, router, isRehydrated]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup({ name, email, password, role }).unwrap();
            alert("Signup successful! Please login.");
            router.push("/login");
        } catch (err) {
            console.error("Signup failed:", err);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-indigo-50 to-blue-100 px-4">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription className="text-gray-500">Join us and start managing your inventory today</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" placeholder="John Doe" className="h-11 shadow-sm border-gray-200 focus:border-indigo-500 transition-all" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" className="h-11 shadow-sm border-gray-200 focus:border-indigo-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" className="h-11 shadow-sm border-gray-200 focus:border-indigo-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Account Role</Label>
                            <select id="role" className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="admin">Administrator</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-4">
                        <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 transition-all font-semibold" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </Button>
                        <p className="text-sm text-center text-gray-500 mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
