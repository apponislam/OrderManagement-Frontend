import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: "order",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Order", "Product"],
        }),
        getAllOrders: builder.query({
            query: (params) => ({
                url: "order",
                method: "GET",
                params,
            }),
            providesTags: ["Order"],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `order/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Order"],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `order/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Order", "Product"],
        }),
    }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } = orderApi;
