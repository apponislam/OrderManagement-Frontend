import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (data) => ({
                url: "category",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        getAllCategories: builder.query({
            query: (params) => ({
                url: "category",
                method: "GET",
                params,
            }),
            providesTags: ["Category"],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `category/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const { useCreateCategoryMutation, useGetAllCategoriesQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi;
