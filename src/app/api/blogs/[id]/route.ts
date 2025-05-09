import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  try {
    await dbConnect();
    const blog = await Blog.findOne({ _id: id, published: true });
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await dbConnect();
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const data = await request.json();
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...data, author: session.user.id },
      { new: true }
    );

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  
  if (!id) {
    return NextResponse.json(
      { message: "Blog ID is required" },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // First check if the blog exists
    const blog = await Blog.findOne({ _id: id });
    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete the specific blog by ID
    const deleteResult = await Blog.deleteOne({ _id: id });
    
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Failed to delete blog" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
} 