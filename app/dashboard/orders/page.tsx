"use client";

import { useState, useMemo } from "react";
import { useCreateOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Plus, Trash2, CheckCircle2, XCircle, Truck, PackageCheck, Search, User, Package, ArrowRight, Loader2, Calendar, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
    const [customerName, setCustomerName] = useState("");
    const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number; name?: string; price?: number }[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

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

        if (product.stock <= 0) {
            alert("This product is currently out of stock.");
            return;
        }

        if (orderItems.some((item) => item.productId === selectedProductId)) {
            alert("This product is already added to the order.");
            return;
        }

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
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleCancelOrder = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(id).unwrap();
        } catch (err) {
            console.error("Failed to cancel order:", err);
        }
    };

    const filteredOrders = orders?.data?.filter((o: any) => o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.status.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            confirmed: "bg-blue-100 text-blue-700",
            shipped: "bg-indigo-100 text-indigo-700",
            delivered: "bg-emerald-100 text-emerald-700",
            cancelled: "bg-rose-100 text-rose-700",
        };
        return <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", styles[status] || "bg-gray-100")}>{status}</span>;
    };

    if (ordersLoading || productsLoading) {
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
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage customer orders and fulfillment.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search by customer or status..." className="pl-10 h-11 bg-white border-gray-200 rounded-xl shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create Order Form */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-6 border-b border-gray-50">
                            <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                                <Plus className="mr-3 h-5 w-5 text-blue-600" />
                                New Order
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmitOrder}>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="customer" className="text-sm font-semibold text-gray-700">
                                        Customer Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input id="customer" placeholder="Enter customer name" className="pl-10 h-11 border-gray-200 rounded-xl" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Add Products</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="product" className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                                                Select Product
                                            </Label>
                                            <select id="product" className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none transition-all" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                                                <option value="">Choose a product...</option>
                                                {products?.data
                                                    ?.filter((p: any) => p.stock > 0)
                                                    .map((product: any) => (
                                                        <option key={product._id} value={product._id}>
                                                            {product.name} (${product.price})
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="quantity" className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                                                    Qty
                                                </Label>
                                                <Input id="quantity" type="number" min="1" className="h-11 border-gray-200 rounded-xl" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Number(e.target.value))} />
                                            </div>
                                            <div className="flex items-end">
                                                <Button type="button" variant="outline" className="w-full h-11 border-gray-200 rounded-xl hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all font-semibold" onClick={handleAddItem}>
                                                    Add Item
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Order Items</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                        {orderItems.length > 0 ? (
                                            orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm animate-in slide-in-from-right-2 duration-200">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                                            <Package className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                            <p className="text-xs text-gray-400 font-medium">
                                                                {item.quantity} × ${item.price?.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg" onClick={() => handleRemoveItem(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50/30 border border-dashed border-gray-200 rounded-2xl">
                                                <ShoppingCart className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                                                <p className="text-xs font-medium text-gray-400">Cart is empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Amount</span>
                                        <span className="text-2xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Button type="submit" className="w-full h-12 bg-gray-900 hover:bg-black text-white transition-all font-bold rounded-xl shadow-lg shadow-gray-200" disabled={isCreating || orderItems.length === 0}>
                                        {isCreating ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                Place Order
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </form>
                    </Card>
                </div>

                {/* Orders List */}
                <Card className="lg:col-span-8 border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-6 border-b border-gray-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-gray-900">Order History</CardTitle>
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Filter className="h-3 w-3 mr-1.5" />
                            {filteredOrders?.length || 0} Orders
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="font-semibold text-gray-600 px-6 h-14">Customer</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-14">Items</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-14 text-right">Total</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-14 text-center">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-600 h-14 text-right px-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders?.length > 0 ? (
                                        filteredOrders.map((order: any) => (
                                            <TableRow key={order._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <TableCell className="px-6 py-5">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{order.customerName}</p>
                                                        <div className="flex items-center text-[10px] text-gray-400 font-bold mt-1 uppercase">
                                                            <Calendar className="h-2.5 w-2.5 mr-1" />
                                                            {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className="flex flex-wrap gap-1.5 max-w-50">
                                                        {order.items.map((item: any, i: number) => (
                                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                                                                {(typeof item.productId === "object" ? item.productId?.name : "Product") || "Product"} ×{item.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-5 font-black text-gray-900">${order.totalPrice.toFixed(2)}</TableCell>
                                                <TableCell className="text-center py-5">{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-right px-6 py-5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {order.status === "pending" && (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Confirm" onClick={() => handleStatusUpdate(order._id, "confirmed")}>
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Cancel" onClick={() => handleCancelOrder(order._id)}>
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {order.status === "confirmed" && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Ship" onClick={() => handleStatusUpdate(order._id, "shipped")}>
                                                                <Truck className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {order.status === "shipped" && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Deliver" onClick={() => handleStatusUpdate(order._id, "delivered")}>
                                                                <PackageCheck className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <ShoppingCart className="h-12 w-12 mb-3 text-gray-200" />
                                                    <p className="text-sm font-medium">No orders found</p>
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
