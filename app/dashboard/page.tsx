"use client";

import { useGetDashboardStatsQuery, useGetActivityLogsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ShoppingCart, 
    Clock, 
    AlertTriangle, 
    TrendingUp,
    CheckCircle2,
    Package
} from "lucide-react";

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery(undefined);
    const { data: activityLogs, isLoading: logsLoading } = useGetActivityLogsQuery(undefined);

    const statCards = [
        {
            title: "Total Orders Today",
            value: stats?.data?.totalOrdersToday || 0,
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Pending Orders",
            value: stats?.data?.pendingOrders || 0,
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
        },
        {
            title: "Low Stock Items",
            value: stats?.data?.lowStockCount || 0,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-100",
        },
        {
            title: "Revenue Today",
            value: `$${stats?.data?.revenueToday || 0}`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
        },
    ];

    if (statsLoading || logsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-full`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            Product Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.data?.productSummary?.map((item: any) => (
                                <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="font-medium">{item.name}</span>
                                    <span className={item.stock <= item.threshold ? "text-red-600 font-bold" : "text-green-600"}>
                                        {item.stock} left {item.stock <= item.threshold && "(Low Stock)"}
                                    </span>
                                </div>
                            )) || <div className="text-gray-500">No product summary available.</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Log */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activityLogs?.data?.map((log: any, index: number) => (
                                <div key={index} className="flex items-start space-x-3 p-3 border-b last:border-0">
                                    <div className="bg-gray-100 p-2 rounded-full mt-0.5">
                                        <Clock className="h-3 w-3 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800">{log.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            )) || <div className="text-gray-500">No recent activity logs.</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
