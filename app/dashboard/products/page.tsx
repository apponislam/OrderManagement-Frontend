"use client";

import { useState } from "react";
import { useCreateProductMutation, useGetAllProductsQuery, useUpdateProductMutation } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Edit2, AlertCircle, Loader2, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProductsPage() {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [minStockThreshold, setMinStockThreshold] = useState("");
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        document.title = "Products | SmartInv";
    }, []);

    const { data: products, isLoading: productsLoading, isFetching: productsFetching } = useGetAllProductsQuery({ page, limit });
    const { data: categories, isLoading: categoriesLoading } = useGetAllCategoriesQuery({ limit: 100 }); // Fetch all for dropdown
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name,
            categoryId,
            price: Number(price),
            stock: Number(stock),
            minStockThreshold: Number(minStockThreshold),
        };

        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct._id, ...payload }).unwrap();
            } else {
                await createProduct(payload).unwrap();
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save product:", err);
            toast.error("Failed to save product.");
        }
    };

    const resetForm = () => {
        setName("");
        setCategoryId("");
        setPrice("");
        setStock("");
        setMinStockThreshold("");
        setEditingProduct(null);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (products?.meta && page < products.meta.totalPage) {
            setPage(page + 1);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setName(product.name);
        // Handle both populated and unpopulated category
        const catId = typeof product.category === "object" ? product.category?._id : product.category;
        setCategoryId(catId || "");
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setMinStockThreshold(product.minStockThreshold.toString());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredProducts = products?.data?.filter((p: any) => {
        const categoryName = typeof p.category === "object" ? p.category?.name : "";
        return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (categoryName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    });

    if (productsLoading || categoriesLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory items and stock levels.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search products or categories..." className="pl-10 h-11 bg-white border-gray-200 rounded-xl shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Card */}
                <Card className="lg:col-span-1 border-0 shadow-sm h-fit sticky top-8">
                    <CardHeader className="pb-6 border-b border-gray-50">
                        <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                            {editingProduct ? <Edit2 className="mr-3 h-5 w-5 text-amber-500" /> : <Plus className="mr-3 h-5 w-5 text-blue-600" />}
                            {editingProduct ? "Edit Product" : "New Product"}
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="pt-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Product Name
                                </Label>
                                <Input id="name" placeholder="e.g. iPhone 15 Pro" className="h-11 border-gray-200 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                                    Category
                                </Label>
                                <select id="category" className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                    <option value="">Select Category</option>
                                    {categories?.data?.map((category: any) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                                        Price ($)
                                    </Label>
                                    <Input id="price" type="number" step="0.01" placeholder="0.00" className="h-11 border-gray-200 rounded-xl" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">
                                        Current Stock
                                    </Label>
                                    <Input id="stock" type="number" placeholder="0" className="h-11 border-gray-200 rounded-xl" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="threshold" className="text-sm font-semibold text-gray-700">
                                    Min Stock Threshold
                                </Label>
                                <Input id="threshold" type="number" placeholder="5" className="h-11 border-gray-200 rounded-xl" value={minStockThreshold} onChange={(e) => setMinStockThreshold(e.target.value)} required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className={cn("flex-1 h-11 font-semibold rounded-xl", editingProduct ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700")} disabled={isCreating || isUpdating}>
                                    {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProduct ? "Update Product" : "Add Product"}
                                </Button>
                                {editingProduct && (
                                    <Button type="button" variant="outline" className="h-11 rounded-xl border-gray-200" onClick={resetForm}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </form>
                </Card>

                {/* Table Card */}
                <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-6 border-b border-gray-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-gray-900">Inventory</CardTitle>
                        <div className="flex items-center text-xs font-medium text-gray-400">
                            <Filter className="h-3 w-3 mr-1" />
                            {filteredProducts?.length || 0} Products
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="font-semibold text-gray-600 px-6 h-12">Product Details</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-12">Price</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-12 text-center">Stock</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-12 text-center">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-12 text-right px-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts?.length > 0 ? (
                                        filteredProducts.map((product: any) => (
                                            <TableRow key={product._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <TableCell className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{product.name}</p>
                                                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-0.5">{typeof product.category === "object" ? product.category?.name : "Uncategorized"}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-700">${product.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={cn("font-bold text-sm", product.stock <= product.minStockThreshold ? "text-rose-600" : "text-gray-700")}>{product.stock}</span>
                                                        {product.stock <= product.minStockThreshold && (
                                                            <div className="flex items-center text-[10px] text-rose-500 font-bold uppercase mt-0.5">
                                                                <AlertCircle className="h-2 w-2 mr-1" />
                                                                Low
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(product)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <Package className="h-12 w-12 mb-3 text-gray-200" />
                                                    <p className="text-sm font-medium">No products found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {products?.meta && products.meta.totalPage > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, products.meta.total)}</span> of <span className="font-medium">{products.meta.total}</span> products
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1 || productsFetching} className="h-9 rounded-lg border-gray-200">
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium px-4">
                                        Page {page} of {products.meta.totalPage}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === products.meta.totalPage || productsFetching} className="h-9 rounded-lg border-gray-200">
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
