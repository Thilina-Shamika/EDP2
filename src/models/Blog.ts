import mongoose from 'mongoose';

export interface IBlog extends mongoose.Document {
  title: string;
  content: string;
  slug: string;
  author: mongoose.Types.ObjectId;
  image: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorName: string;
  subHeading?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an author'],
  },
  authorName: {
    type: String,
    required: [true, 'Please provide an author name'],
  },
  subHeading: {
    type: String,
    default: '',
  },
  excerpt: {
    type: String,
    default: '',
  },
  metaTitle: {
    type: String,
    default: '',
  },
  metaDescription: {
    type: String,
    default: '',
  },
  metaKeywords: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Please provide an image'],
  },
  tags: [{
    type: String,
  }],
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema); 