"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  _id: string;
  title: string;
  image: string;
}

const MediaCenter = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?limit=6', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
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