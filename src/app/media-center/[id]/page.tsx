"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  excerpt: string;
  authorName: string;
  createdAt: string;
}

export default function BlogPost() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Blog not found'}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-26">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Media Center Pill */}
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              Media Center
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            {blog.excerpt}
          </p>

          {/* Date and Author */}
          <div className="flex justify-center items-center gap-4 mb-12 text-sm text-gray-500">
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{blog.authorName}</span>
          </div>

          {/* Featured Image */}
          <div className="relative w-full aspect-[16/9] mb-12 rounded-lg overflow-hidden">
            <Image
              src={blog.image || '/placeholder.jpg'}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              style={{
                wordWrap: 'break-word',
                fontFamily: 'inherit',
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}
              dangerouslySetInnerHTML={{ 
                __html: blog.content
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 