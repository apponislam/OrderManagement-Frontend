"use client";

import { useGetRestockQueueQuery } from "@/redux/features/dashboard/dashboardApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { AlertCircle, ArrowUpCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestockQueuePage() {
    const { data: queue, isLoading: queueLoading } = useGetRestockQueueQuery(undefined);
    const [updateProduct, { isLoading: isRestocking }] = useUpdateProductMutation();

    const handleRestock = async (product: any) => {
        const restockAmount = prompt(`How many units of ${product.name} would you like to add?`, "10");
        if (restockAmount === null || isNaN(Number(restockAmount))) return;

        try {
            await updateProduct({ 
                id: product._id, 
                stock: product.stock + Number(restockAmount) 
            }).unwrap();
            alert(`Restocked ${product.name} with ${restockAmount} more units.`);
        } catch (err) {
            console.error("Restock failed:", err);
            alert("Restock failed. Please try again.");
        }
    };

    const getPriorityBadge = (stock: number, threshold: number) => {
        const diff = threshold - stock;
        let color = "bg-yellow-100 text-yellow-700";
        let label = "Medium";

        if (stock === 0) {
            color = "bg-red-100 text-red-700";
            label = "High";
        } else if (diff > 5) {
            color = "bg-red-100 text-red-700";
            label = "High";
        } else if (diff <= 2) {
            color = "bg-blue-100 text-blue-700";
            label = "Low";
        }

        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
    };

    if (queueLoading) {
        return <div>Loading queue...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center text-red-600">
                    <AlertCircle className="mr-3 h-8 w-8" />
                    Restock Queue
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center">
                        <ArrowUpCircle className="mr-2 h-5 w-5 text-red-500" />
                        Low Stock Items (Ordered by Priority)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Threshold</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queue?.data?.map((product: any) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-red-600 font-bold">{product.stock}</TableCell>
                                    <TableCell>{product.minStockThreshold}</TableCell>
                                    <TableCell>{getPriorityBadge(product.stock, product.minStockThreshold)}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleRestock(product)}
                                            disabled={isRestocking}
                                        >
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                            Restock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) || (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                        All items are properly stocked! No low-stock items in the queue.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
