// src/api.ts
import axios from "axios";
import type { Post } from "./App";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Fetch all posts
export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>("/posts");
  return response.data;
};

// Fetch a single post by ID
export const getPostById = async (id: number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

// Create a new post
export const createPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const response = await api.post<Post>("/posts", post);
  console.log(response.data);
  return response.data;
};

// Update a post
export const updatePost = async (post: Post): Promise<Post> => {
  const response = await api.put<Post>(`/posts/${post.id}`, post);
  console.log(response.data);
  return response.data;
};

// Delete a post
export const deletePost = async (id: number): Promise<void> => {
  const response = await api.delete(`/posts/${id}`);
  console.log(response.data);
  return response.data;
};
