"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import RichTextEditor from '@/components/shared/RichTextEditor';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  subHeading?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  authorName?: string;
}

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [article, setArticle] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data);
        setTitle(data.title);
        setSubHeading(data.subHeading || "");
        setExcerpt(data.excerpt || "");
        setArticle(data.content);
        setCurrentImage(data.image);
        setTags(data.tags || []);
        setMetaTitle(data.metaTitle || "");
        setMetaDescription(data.metaDescription || "");
        setMetaKeywords(data.metaKeywords || "");
        setAuthorName(data.authorName || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle tags as chips
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  // Cloudinary upload helper
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edprop_unsigned");
    formData.append("cloud_name", "djoe6vb5c");
    const res = await fetch("https://api.cloudinary.com/v1_1/djoe6vb5c/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  // Slug generator
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!session?.user?.id) {
      setError("You must be logged in to edit a blog post");
      setSaving(false);
      return;
    }

    if (!title) { setError("Title is required."); setSaving(false); return; }
    if (!article) { setError("Article is required."); setSaving(false); return; }
    if (!authorName) { setError("Author name is required."); setSaving(false); return; }

    let imageUrl = currentImage;
    if (featuredImage) {
      try {
        imageUrl = await uploadImageToCloudinary(featuredImage);
      } catch {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }
    }

    const slug = slugify(title);
    const data = {
      title,
      subHeading,
      excerpt,
      content: article,
      image: imageUrl,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      slug,
      authorName,
    };

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update blog post");
      }
      router.push("/admin/manage-blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
        <div className="bg-white rounded-lg p-8 shadow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Author Name</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Sub Heading</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={subHeading} onChange={e => setSubHeading(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Excerpt</label>
              <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Article</label>
              <RichTextEditor content={article} onChange={setArticle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Featured Image</label>
              <input type="file" accept="image/*" className="mt-1 block w-full" onChange={e => setFeaturedImage(e.target.files?.[0] || null)} />
              {(featuredImage || currentImage) && (
                <div className="relative w-24 h-24 mt-4 border rounded overflow-hidden group">
                  <Image
                    src={featuredImage ? URL.createObjectURL(featuredImage) : currentImage}
                    alt="Featured image"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null);
                      setCurrentImage("");
                    }}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Tags</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter or Comma"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center">
                    {tag}
                    <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => removeTag(idx)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Meta Title</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Meta Description</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Meta Keywords</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} placeholder="Comma separated keywords" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="rounded-full bg-black text-white px-8 py-2 font-semibold text-lg shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 