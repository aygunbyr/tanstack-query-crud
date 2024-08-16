// src/App.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";

export interface Todo {
  id: string;
  title: string;
  body: string;
  userId: number;
}

function App() {
  const queryClient = useQueryClient();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch Todos
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Create Todo Mutation
  const createTodoMutation = useMutation<Todo, unknown, Omit<Todo, "id">>({
    mutationFn: (todo: Omit<Todo, "id">) => createTodo(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Update Todo Mutation
  const updateTodoMutation = useMutation<Todo, unknown, Todo>({
    mutationFn: (todo: Todo) => updateTodo(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodo(null); // formu temizle
    },
  });

  // Delete Todo Mutation
  const deleteTodoMutation = useMutation<unknown, unknown, string>({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTodo) {
      // Update Todo
      updateTodoMutation.mutate({
        id: selectedTodo.id,
        title,
        body,
        userId: parseInt(userId),
      });
    } else {
      // Create Todo
      createTodoMutation.mutate({
        title,
        body,
        userId: parseInt(userId),
      } as Omit<Todo, "id">);
    }
    setTitle("");
    setBody("");
    setUserId("");
  };

  const handleDelete = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setBody(todo.body);
    setUserId(todo.userId.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong</div>;

  return (
    <div>
      <h1>TanStack Query CRUD</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          rows={3}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">
          {selectedTodo ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <ul>
        {todos?.map((todo: Todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.body}</p>
            <p>User #{todo.userId}</p>
            <button onClick={() => handleEdit(todo)}>Edit</button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
