"use client";

import { useState } from "react";
import { useCreateProductMutation, useGetAllProductsQuery, useUpdateProductMutation } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Edit2, AlertCircle } from "lucide-react";

export default function ProductsPage() {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [minStockThreshold, setMinStockThreshold] = useState("");
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const { data: products, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
    const { data: categories, isLoading: categoriesLoading } = useGetAllCategoriesQuery(undefined);
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
                alert("Product updated successfully!");
                setEditingProduct(null);
            } else {
                await createProduct(payload).unwrap();
                alert("Product created successfully!");
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product.");
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

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setName(product.name);
        setCategoryId(product.category._id);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setMinStockThreshold(product.minStockThreshold.toString());
    };

    if (productsLoading || categoriesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center">
                    <Package className="mr-3 h-8 w-8 text-primary" />
                    Product Management
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center">
                            {editingProduct ? <Edit2 className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                            {editingProduct ? "Update Product" : "New Product"}
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
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
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Initial Stock</Label>
                                    <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="threshold">Min Stock Threshold</Label>
                                <Input id="threshold" type="number" value={minStockThreshold} onChange={(e) => setMinStockThreshold(e.target.value)} required />
                            </div>
                            <div className="flex space-x-2">
                                <Button type="submit" className="flex-1" disabled={isCreating || isUpdating}>
                                    {isCreating || isUpdating ? "Saving..." : editingProduct ? "Update" : "Create"}
                                </Button>
                                {editingProduct && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </form>
                </Card>

                {/* Table Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Inventory List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.data?.map((product: any) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {product.stock}
                                                {product.stock <= product.minStockThreshold && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{product.stock > 0 ? "Active" : "Out of Stock"}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) || (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                            No products found. Add some products to the inventory.
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
