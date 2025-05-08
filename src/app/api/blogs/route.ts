import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog, { IBlog } from '@/models/Blog';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in API:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json({ message: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    await connectDB();

    const formData = await req.json();
    console.log('API RECEIVED:', JSON.stringify(formData, null, 2));

    // Map form fields to model fields
    const blogData: Partial<IBlog> = {
      title: formData.title,
      content: formData.article, // Map article to content
      image: formData.featuredImage, // Map featuredImage to image
      tags: formData.tags || [],
      slug: formData.slug,
      author: new mongoose.Types.ObjectId(session.user.id),
      authorName: formData.authorName,
      subHeading: formData.subHeading,
      excerpt: formData.excerpt,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      metaKeywords: formData.metaKeywords,
      published: false
    };
    console.log('Blog data to save:', JSON.stringify(blogData, null, 2));

    // Validate required fields
    const requiredFields = [
      'title',
      'content',
      'image',
      'tags'
    ] as const;

    const missingFields = requiredFields.filter(field => !blogData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new blog
    const blog = await Blog.create(blogData);
    console.log('Created blog:', blog);

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating blog:', error);
    
    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as mongoose.Error.ValidationError).errors)
        .map(err => err.message);
      return NextResponse.json(
        { message: 'Validation error', errors: validationErrors },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const query = published ? { published: published === 'true' } : {};

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
      
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 