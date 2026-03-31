"use client";

import { useState } from "react";
import { useGetActivityLogsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Loader2, Calendar, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function ActivitiesPage() {
    const [page, setPage] = useState(1);
    const limit = 15;

    useEffect(() => {
        document.title = "Activities | SmartInv";
    }, []);

    const { data: activities, isLoading, isFetching } = useGetActivityLogsQuery({ page, limit });

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (activities?.meta && page < activities.meta.totalPage) {
            setPage(page + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const logs = activities?.data || [];
    const meta = activities?.meta;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Activities</h1>
                    <p className="text-gray-500 mt-1">Track all system changes and user actions.</p>
                </div>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="pb-6 border-b border-gray-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <History className="mr-3 h-5 w-5 text-blue-600" />
                        Activity Logs
                    </CardTitle>
                    <div className="text-xs font-medium text-gray-400">Total {meta?.total || 0} activities</div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    <TableHead className="font-semibold text-gray-600 px-6 h-12">Action / Message</TableHead>
                                    <TableHead className="font-semibold text-gray-600 h-12">Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length > 0 ? (
                                    logs.map((log: any) => (
                                        <TableRow key={log._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-800">{log.message}</p>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500 py-4">
                                                <div className="flex items-center">
                                                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                    {new Date(log.createdAt).toLocaleString([], {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Inbox className="h-12 w-12 mb-3 text-gray-200" />
                                                <p className="text-sm font-medium">No activity logs found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {meta && meta.totalPage > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> activities
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1 || isFetching} className="h-9 rounded-lg border-gray-200">
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium px-4">
                                    Page {page} of {meta.totalPage}
                                </div>
                                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === meta.totalPage || isFetching} className="h-9 rounded-lg border-gray-200">
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
