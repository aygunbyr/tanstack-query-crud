// src/api.ts
import axios from "axios";
import type { Todo } from "./App";

const api = axios.create({
  baseURL: "http://localhost:3500",
});

// Fetch all todos
export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get<Todo[]>("/todos");
  return response.data;
};

// Fetch a single todo by ID
export const getTodoById = async (id: number): Promise<Todo> => {
  const response = await api.get<Todo>(`/todos/${id}`);
  return response.data;
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo> => {
  const response = await api.post<Todo>("/todos", todo);
  console.log(response.data);
  return response.data;
};

// Update a todo
export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await api.put<Todo>(`/todos`, todo);
  console.log(response.data);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<unknown> => {
  const response = await api.delete(`/todos/${id}`);
  console.log(response);
  return response;
};
