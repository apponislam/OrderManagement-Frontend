"use client";

import { useState, useMemo } from "react";
import { useCreateOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Plus, Trash2, CheckCircle2, XCircle, Truck, PackageCheck } from "lucide-react";

export default function OrdersPage() {
    const [customerName, setCustomerName] = useState("");
    const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number; name?: string; price?: number }[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery(undefined);
    const { data: products, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const totalPrice = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    }, [orderItems]);

    const handleAddItem = () => {
        if (!selectedProductId) return;

        const product = products?.data?.find((p: any) => p._id === selectedProductId);
        if (!product) return;

        // Conflict Detection: Prevent ordering inactive/out of stock products
        if (product.stock <= 0) {
            alert("This product is currently out of stock.");
            return;
        }

        // Conflict Detection: Prevent duplicates
        if (orderItems.some((item) => item.productId === selectedProductId)) {
            alert("This product is already added to the order.");
            return;
        }

        // Stock Validation
        if (selectedQuantity > product.stock) {
            alert(`Only ${product.stock} items available in stock.`);
            return;
        }

        setOrderItems([
            ...orderItems,
            {
                productId: selectedProductId,
                quantity: selectedQuantity,
                name: product.name,
                price: product.price,
            },
        ]);
        setSelectedProductId("");
        setSelectedQuantity(1);
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (orderItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        try {
            await createOrder({
                customerName,
                items: orderItems.map(({ productId, quantity }) => ({ productId, quantity })),
            }).unwrap();
            alert("Order created successfully!");
            setCustomerName("");
            setOrderItems([]);
        } catch (err: any) {
            console.error("Failed to create order:", err);
            alert(err?.data?.message || "Failed to create order.");
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await updateOrderStatus({ id, status }).unwrap();
            alert(`Order status updated to ${status}!`);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status.");
        }
    };

    const handleCancelOrder = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(id).unwrap();
            alert("Order cancelled successfully!");
        } catch (err) {
            console.error("Failed to cancel order:", err);
            alert("Failed to cancel order.");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700",
            confirmed: "bg-blue-100 text-blue-700",
            shipped: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100"}`}>{status.toUpperCase()}</span>;
    };

    if (ordersLoading || productsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center">
                    <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
                    Order Management
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Order Form */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center">
                            <Plus className="mr-2 h-5 w-5" />
                            New Order
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmitOrder}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="customer">Customer Name</Label>
                                <Input id="customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                            </div>

                            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                <h3 className="font-semibold text-sm">Add Items</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="product">Select Product</Label>
                                    <select id="product" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                                        <option value="">Select Product</option>
                                        {products?.data
                                            ?.filter((p: any) => p.stock > 0)
                                            .map((product: any) => (
                                                <option key={product._id} value={product._id}>
                                                    {product.name} (${product.price} - {product.stock} in stock)
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" min="1" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Number(e.target.value))} />
                                </div>
                                <Button type="button" variant="outline" className="w-full" onClick={handleAddItem}>
                                    Add to List
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Order Items</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded bg-white">
                                            <div className="text-sm">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-gray-500">
                                                    {item.quantity} x ${item.price}
                                                </p>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                    {orderItems.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No items added yet.</p>}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-bold">Total:</span>
                                <span className="text-xl font-bold text-primary">${totalPrice}</span>
                            </div>

                            <Button type="submit" className="w-full" disabled={isCreating || orderItems.length === 0}>
                                {isCreating ? "Processing..." : "Place Order"}
                            </Button>
                        </CardContent>
                    </form>
                </Card>

                {/* Orders List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.data?.map((order: any) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">{order.customerName}</TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                {order.items.map((item: any, i: number) => (
                                                    <p key={i}>
                                                        {item.productId?.name || "Deleted Product"} (x{item.quantity})
                                                    </p>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>${order.totalPrice}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                {order.status === "pending" && (
                                                    <>
                                                        <Button variant="ghost" size="sm" title="Confirm" onClick={() => handleStatusUpdate(order._id, "confirmed")}>
                                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" title="Cancel" onClick={() => handleCancelOrder(order._id)}>
                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </>
                                                )}
                                                {order.status === "confirmed" && (
                                                    <Button variant="ghost" size="sm" title="Ship" onClick={() => handleStatusUpdate(order._id, "shipped")}>
                                                        <Truck className="h-4 w-4 text-purple-500" />
                                                    </Button>
                                                )}
                                                {order.status === "shipped" && (
                                                    <Button variant="ghost" size="sm" title="Deliver" onClick={() => handleStatusUpdate(order._id, "delivered")}>
                                                        <PackageCheck className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) || (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            No orders found.
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
