import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: "/dashboard/stats",
                method: "GET",
            }),
            providesTags: ["Order", "Product"],
        }),
        getRestockQueue: builder.query({
            query: () => ({
                url: "/dashboard/restock-queue",
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        getActivityLogs: builder.query({
            query: () => ({
                url: "/activity",
                method: "GET",
            }),
            providesTags: ["Order", "Product", "Category"],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useGetRestockQueueQuery, useGetActivityLogsQuery } = dashboardApi;
