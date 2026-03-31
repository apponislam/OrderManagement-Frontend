"use client";

import { useGetDashboardStatsQuery, useGetActivityLogsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ShoppingCart, 
    Clock, 
    AlertTriangle, 
    TrendingUp,
    CheckCircle2,
    Package,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function Dashboard() {
    useEffect(() => {
        document.title = "Overview | SmartInv";
    }, []);

    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery(undefined);
    const { data: activityLogs, isLoading: logsLoading } = useGetActivityLogsQuery(undefined);

    const statCards = [
        {
            title: "Total Orders Today",
            value: stats?.data?.totalOrdersToday || 0,
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
        },
        {
            title: "Pending Orders",
            value: stats?.data?.pendingOrders || 0,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
        },
        {
            title: "Low Stock Items",
            value: stats?.data?.lowStockCount || 0,
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
        },
        {
            title: "Revenue Today",
            value: `$${(stats?.data?.revenueToday || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
        },
    ];

    if (statsLoading || logsLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your inventory today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className={cn("border-0 shadow-sm transition-all hover:shadow-md", stat.bg)}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.title}</CardTitle>
                            <div className={cn("p-2 rounded-xl border bg-white shadow-sm", stat.border, stat.color)}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <span className="text-xs font-medium text-gray-400 flex items-center">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    Live
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Summary */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-50 pb-6">
                        <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                            <Package className="mr-3 h-5 w-5 text-blue-600" />
                            Inventory Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {stats?.data?.productSummary?.length > 0 ? (
                                stats?.data?.productSummary?.map((item: any) => (
                                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-white hover:border-blue-100">
                                        <div className="flex items-center">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mr-3",
                                                item.stock <= item.threshold ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                                            )} />
                                            <span className="font-semibold text-gray-800">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "text-sm font-bold",
                                                item.stock <= item.threshold ? "text-rose-600" : "text-emerald-600"
                                            )}>
                                                {item.stock} units left
                                            </p>
                                            {item.stock <= item.threshold && (
                                                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-tighter">Low Stock</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm font-medium">No inventory data available.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Log */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-50 pb-6">
                        <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                            <CheckCircle2 className="mr-3 h-5 w-5 text-indigo-600" />
                            Recent Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {activityLogs?.data?.length > 0 ? (
                                activityLogs?.data?.map((log: any, index: number) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="mt-1 bg-indigo-50 p-2 rounded-full border border-indigo-100">
                                            <Clock className="h-3 w-3 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                            <p className="text-sm font-medium text-gray-800 leading-snug">{log.message}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-medium">{new Date(log.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Clock className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm font-medium">No activity logs found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
