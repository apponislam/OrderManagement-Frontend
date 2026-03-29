"use client";

import { useState } from "react";
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Tags, Loader2, Search, Inbox } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { data: categories, isLoading } = useGetAllCategoriesQuery(undefined);
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await createCategory({ name }).unwrap();
            setName("");
        } catch (err) {
            console.error("Failed to create category:", err);
            toast.error("Failed to create category.");
        }
    };

    const filteredCategories = categories?.data?.filter((cat: any) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-gray-500 mt-1">Organize your products with categories.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search categories..." className="pl-10 h-11 bg-white border-gray-200 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Category Form */}
                <Card className="lg:col-span-1 border-0 shadow-sm h-fit">
                    <CardHeader className="pb-6 border-b border-gray-50">
                        <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                            <Plus className="mr-3 h-5 w-5 text-blue-600" />
                            New Category
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleCreateCategory}>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Category Name
                                </Label>
                                <Input id="name" placeholder="e.g. Electronics" className="h-11 border-gray-200 rounded-xl focus:border-blue-500 transition-all" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all font-semibold rounded-xl" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Category"
                                )}
                            </Button>
                        </CardContent>
                    </form>
                </Card>

                {/* Categories Table */}
                <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-6 border-b border-gray-50">
                        <CardTitle className="text-xl font-bold text-gray-900">Category List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="w-16 font-semibold text-gray-600 px-6">#</TableHead>
                                        <TableHead className="font-semibold text-gray-600">Category Name</TableHead>
                                        <TableHead className="font-semibold text-gray-600">Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories?.length > 0 ? (
                                        filteredCategories.map((category: any, index: number) => (
                                            <TableRow key={category._id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="px-6 font-medium text-gray-400 text-xs">{index + 1}</TableCell>
                                                <TableCell className="font-semibold text-gray-800">{category.name}</TableCell>
                                                <TableCell className="text-sm text-gray-500 font-medium">{new Date(category.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <Inbox className="h-12 w-12 mb-3 text-gray-200" />
                                                    <p className="text-sm font-medium">No categories found</p>
                                                    <p className="text-xs">Create a category to get started.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
