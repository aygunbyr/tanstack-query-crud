// src/App.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, updatePost, deletePost } from "./api";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function App() {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch Posts
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // Create Post Mutation
  const createPostMutation = useMutation<Post, unknown, Omit<Post, "id">>({
    mutationFn: (post: Omit<Post, "id">) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Update Post Mutation
  const updatePostMutation = useMutation<Post, unknown, Post>({
    mutationFn: (post: Post) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setSelectedPost(null); // formu temizle
    },
  });

  // Delete Post Mutation
  const deletePostMutation = useMutation<void, unknown, number>({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPost) {
      // Update Post
      updatePostMutation.mutate({
        id: selectedPost.id,
        title,
        body,
        userId: parseInt(userId),
      });
    } else {
      // Create Post
      createPostMutation.mutate({
        title,
        body,
        userId: parseInt(userId),
      } as Omit<Post, "id">);
    }
    setTitle("");
    setBody("");
    setUserId("");
  };

  const handleDelete = (id: number) => {
    deletePostMutation.mutate(id);
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setBody(post.body);
    setUserId(post.userId.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong</div>;

  return (
    <div>
      <h1>TanStack Query CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">
          {selectedPost ? "Update Post" : "Add Post"}
        </button>
      </form>

      <ul>
        {posts?.map((post: Post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p>{post.userId}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
