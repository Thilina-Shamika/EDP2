"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  _id: string;
  title: string;
  image: string;
  excerpt?: string;
  authorName?: string;
  createdAt?: string;
}

const MediaCenter = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('MediaCenter - Fetching blogs...');
        const response = await fetch('/api/blogs?limit=6', {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store'
        });

        console.log('MediaCenter - Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('MediaCenter - Error response:', errorText);
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('MediaCenter - Invalid content type:', contentType);
          throw new Error('Invalid response format from server');
        }

        const data = await response.json();
        console.log('MediaCenter - Received data:', data);
        
        if (!Array.isArray(data)) {
          console.error('MediaCenter - Invalid data format:', data);
          throw new Error('Invalid response format from server');
        }

        // Validate each blog object
        const validBlogs = data.filter(blog => {
          const isValid = blog && 
            typeof blog._id === 'string' && 
            typeof blog.title === 'string' && 
            typeof blog.image === 'string';
          
          if (!isValid) {
            console.error('MediaCenter - Invalid blog object:', blog);
          }
          return isValid;
        });

        if (validBlogs.length === 0) {
          console.log('MediaCenter - No valid blogs found');
        }

        setBlogs(validBlogs);
      } catch (error) {
        console.error('MediaCenter - Error fetching blogs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col justify-center pr-[15px]">
            <div className="text-sm text-gray-600 mb-4">Media Center</div>
            <h2 className="text-4xl font-bold mb-6">
              Elite Destination Property Media Center
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our latest property showcases, market insights, and success stories right here. We&apos;re excited to share how we&apos;re helping investors like you find exceptional opportunities in the UAE&apos;s premium real estate market.
            </p>
            <div>
              <Link 
                href="/media-center" 
                className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Visit Media Center
              </Link>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="text-gray-600 text-center">No blog posts found</div>
            ) : (
              <>
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  {blogs.slice(0, 2).map((blog) => (
                    <Link key={blog._id} href={`/media-center/${blog._id}`}>
                      <div>
                        <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                          <Image
                            src={blog.image || '/placeholder.jpg'}
                            alt={blog.title || 'Blog Image'}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        <p className="text-center text-sm font-medium uppercase">{blog.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  {blogs.slice(2, 4).map((blog) => (
                    <Link key={blog._id} href={`/media-center/${blog._id}`}>
                      <div>
                        <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                          <Image
                            src={blog.image || '/placeholder.jpg'}
                            alt={blog.title || 'Blog Image'}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        <p className="text-center text-sm font-medium uppercase">{blog.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-4">
                  {blogs.slice(4, 6).map((blog) => (
                    <Link key={blog._id} href={`/media-center/${blog._id}`}>
                      <div>
                        <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                          <Image
                            src={blog.image || '/placeholder.jpg'}
                            alt={blog.title || 'Blog Image'}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        <p className="text-center text-sm font-medium uppercase">{blog.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCenter; 