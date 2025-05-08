"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  authorName: string;
}

export default function ManageBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    setPublishLoading(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update blog status");
      setBlogs(blogs.map(blog => 
        blog._id === id ? { ...blog, published: !currentStatus } : blog
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blog status");
    } finally {
      setPublishLoading(null);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#393e46' }}>Manage Blog Posts</h1>
        <Link href="/admin/add-blog" className="rounded-full bg-black text-white px-6 py-2 font-semibold text-sm shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Blog
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm" style={{ color: '#393e46' }}>
                    No blog posts found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.image && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium" style={{ color: '#393e46' }}>{blog.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: '#000000' }}>{blog.authorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100" style={{ color: '#000000' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="inline-flex items-center cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={blog.published}
                          onChange={() => !publishLoading && handlePublishToggle(blog._id, blog.published)}
                          disabled={publishLoading === blog._id}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="text-sm font-medium" style={{ color: blog.published ? '#22c55e' : '#ef4444' }}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#393e46' }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/admin/edit-blog/${blog._id}`}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 