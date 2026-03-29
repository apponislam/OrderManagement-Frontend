"use client";

import { useGetRestockQueueQuery } from "@/redux/features/dashboard/dashboardApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowUpCircle, RefreshCcw, Loader2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RestockQueuePage() {
    const { data: queue, isLoading: queueLoading } = useGetRestockQueueQuery(undefined);
    const [updateProduct, { isLoading: isRestocking }] = useUpdateProductMutation();

    const handleRestock = async (product: any) => {
        const restockAmount = prompt(`How many units of ${product.name} would you like to add?`, "10");
        if (restockAmount === null || isNaN(Number(restockAmount))) return;

        try {
            await updateProduct({
                id: product._id,
                stock: product.stock + Number(restockAmount),
            }).unwrap();
        } catch (err) {
            console.error("Restock failed:", err);
            alert("Restock failed. Please try again.");
        }
    };

    const getPriorityBadge = (stock: number, threshold: number) => {
        const diff = threshold - stock;
        let style = "bg-amber-100 text-amber-700 border-amber-200";
        let label = "Medium Priority";

        if (stock === 0) {
            style = "bg-rose-100 text-rose-700 border-rose-200";
            label = "Urgent: Out of Stock";
        } else if (diff > 5) {
            style = "bg-rose-50 text-rose-600 border-rose-100";
            label = "High Priority";
        } else if (diff <= 2) {
            style = "bg-blue-50 text-blue-600 border-blue-100";
            label = "Low Priority";
        }

        return <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", style)}>{label}</span>;
    };

    if (queueLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <AlertCircle className="mr-3 h-8 w-8 text-rose-500" />
                    Restock Queue
                </h1>
                <p className="text-gray-500 mt-1">Priority list of items that need replenishment.</p>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="pb-6 border-b border-gray-50 bg-gray-50/30">
                    <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                        <ArrowUpCircle className="mr-3 h-5 w-5 text-rose-500" />
                        Items Below Threshold
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    <TableHead className="font-semibold text-gray-600 px-6 h-14">Product Name</TableHead>
                                    <TableHead className="font-semibold text-gray-600 h-14 text-center">Current Stock</TableHead>
                                    <TableHead className="font-semibold text-gray-600 h-14 text-center">Threshold</TableHead>
                                    <TableHead className="font-semibold text-gray-600 h-14 text-center">Priority Status</TableHead>
                                    <TableHead className="font-semibold text-gray-600 h-14 text-right px-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queue?.data?.length > 0 ? (
                                    queue?.data?.map((product: any) => (
                                        <TableRow key={product._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <TableCell className="px-6 py-5">
                                                <p className="font-bold text-gray-900">{product.name}</p>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-0.5">
                                                    {typeof product.category === "object" ? product.category?.name : "Uncategorized"}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-center py-5">
                                                <span className={cn("text-lg font-black", product.stock === 0 ? "text-rose-600" : "text-amber-600")}>{product.stock}</span>
                                            </TableCell>
                                            <TableCell className="text-center py-5 font-bold text-gray-400">{product.minStockThreshold}</TableCell>
                                            <TableCell className="text-center py-5">{getPriorityBadge(product.stock, product.minStockThreshold)}</TableCell>
                                            <TableCell className="text-right px-6 py-5">
                                                <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-bold shadow-sm" onClick={() => handleRestock(product)} disabled={isRestocking}>
                                                    <RefreshCcw className={cn("mr-2 h-4 w-4", isRestocking && "animate-spin")} />
                                                    Restock
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-80 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-emerald-50 p-6 rounded-full mb-4">
                                                    <PackageSearch className="h-12 w-12 text-emerald-500" />
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">Inventory is Healthy</p>
                                                <p className="text-sm text-gray-400 max-w-62.5 mx-auto mt-1">No products are currently below their minimum stock threshold.</p>
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
    );
}
