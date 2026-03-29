import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: "/product",
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/product/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});

export const { useCreateProductMutation, useGetAllProductsQuery, useUpdateProductMutation } = productApi;
