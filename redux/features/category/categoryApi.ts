import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/category",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        getAllCategories: builder.query({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
            providesTags: ["Category"],
        }),
    }),
});

export const { useCreateCategoryMutation, useGetAllCategoriesQuery } = categoryApi;
