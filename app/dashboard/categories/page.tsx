"use client";

import { useState } from "react";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Tags, Loader2, Search, Inbox, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function CategoriesPage() {
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        document.title = "Categories | SmartInv";
    }, []);

    const { data: categories, isLoading, isFetching } = useGetAllCategoriesQuery({ page, limit });
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await createCategory({ name }).unwrap();
            setName("");
            toast.success("Category created successfully.");
        } catch (err) {
            console.error("Failed to create category:", err);
            toast.error("Failed to create category.");
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !editingCategory) return;
        try {
            await updateCategory({ id: editingCategory._id, name }).unwrap();
            setName("");
            setEditingCategory(null);
            toast.success("Category updated successfully.");
        } catch (err) {
            console.error("Failed to update category:", err);
            toast.error("Failed to update category.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted successfully.");
        } catch (err) {
            console.error("Failed to delete category:", err);
            toast.error("Failed to delete category.");
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setName(category.name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingCategory(null);
        setName("");
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (categories?.meta && page < categories.meta.totalPage) {
            setPage(page + 1);
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
                {/* Create/Update Category Form */}
                <Card className="lg:col-span-1 border-0 shadow-sm h-fit">
                    <CardHeader className="pb-6 border-b border-gray-50">
                        <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                            {editingCategory ? (
                                <>
                                    <Edit2 className="mr-3 h-5 w-5 text-blue-600" />
                                    Edit Category
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-3 h-5 w-5 text-blue-600" />
                                    New Category
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Category Name
                                </Label>
                                <Input id="name" placeholder="e.g. Electronics" className="h-11 border-gray-200 rounded-xl focus:border-blue-500 transition-all" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 transition-all font-semibold rounded-xl" disabled={isCreating || isUpdating}>
                                    {isCreating || isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editingCategory ? "Updating..." : "Creating..."}
                                        </>
                                    ) : editingCategory ? (
                                        "Update Category"
                                    ) : (
                                        "Create Category"
                                    )}
                                </Button>
                                {editingCategory && (
                                    <Button type="button" variant="outline" className="h-11 rounded-xl border-gray-200 hover:bg-gray-50" onClick={resetForm}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
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
                                        <TableHead className="font-semibold text-gray-600 text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories?.length > 0 ? (
                                        filteredCategories.map((category: any, index: number) => (
                                            <TableRow key={category._id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="px-6 font-medium text-gray-400 text-xs">{index + 1}</TableCell>
                                                <TableCell className="font-semibold text-gray-800">{category.name}</TableCell>
                                                <TableCell className="text-sm text-gray-500 font-medium">{new Date(category.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                                                <TableCell className="text-right pr-6 space-x-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg" onClick={() => handleEdit(category)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteCategory(category._id)} disabled={isDeleting}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-64 text-center">
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

                        {/* Pagination */}
                        {categories?.meta && categories.meta.totalPage > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, categories.meta.total)}</span> of <span className="font-medium">{categories.meta.total}</span> categories
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1 || isFetching} className="h-9 rounded-lg border-gray-200">
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium px-4">
                                        Page {page} of {categories.meta.totalPage}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === categories.meta.totalPage || isFetching} className="h-9 rounded-lg border-gray-200">
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
