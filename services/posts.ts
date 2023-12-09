import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type PostType = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const postsApi = createApi({
  reducerPath: "posts",
  tagTypes: ["Create", "Update", "Delete"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders(headers) {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    findAllPosts: builder.query<PostType[], void>({
      query: () => "/posts",
      providesTags: ["Create", "Delete", "Update"],
    }),
    createPost: builder.mutation<PostType, { author: string; content: string }>(
      {
        query: (body) => ({
          url: "/posts",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Create"],
      }
    ),
    updatePost: builder.mutation<PostType, { id: number; content: string }>({
      query: ({ id, content }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Update"],
    }),
    deletePost: builder.mutation<string, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Delete"],
    }),
  }),
});

export const {
  useFindAllPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postsApi;
