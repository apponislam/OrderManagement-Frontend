"use client";

import { useState } from "react";
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Plus, Tags } from "lucide-react";

export default function CategoriesPage() {
    const [name, setName] = useState("");
    const { data: categories, isLoading } = useGetAllCategoriesQuery(undefined);
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory({ name }).unwrap();
            setName("");
            alert("Category created successfully!");
        } catch (err) {
            console.error("Failed to create category:", err);
            alert("Failed to create category.");
        }
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center">
                    <Tags className="mr-3 h-8 w-8 text-primary" />
                    Category Management
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Category Form */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center">
                            <Plus className="mr-2 h-5 w-5" />
                            New Category
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleCreateCategory}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Electronics"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Create Category"}
                            </Button>
                        </CardContent>
                    </form>
                </Card>

                {/* Categories Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">All Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.data?.map((category: any, index: number) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                )) || (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                            No categories found. Create one to get started!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
