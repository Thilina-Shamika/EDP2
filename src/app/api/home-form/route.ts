import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const HomeFormSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  type: String,
  message: String,
}, { timestamps: true, collection: 'homeforms' });

const HomeFormSubmission = mongoose.models.HomeFormSubmission || mongoose.model('HomeFormSubmission', HomeFormSchema);

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, email, type, message } = body;
    
    if (!name || !phone || !email || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const submission = await HomeFormSubmission.create({ name, phone, email, type, message });
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error saving home form submission:', error);
    return NextResponse.json({ error: 'Failed to save form submission' }, { status: 500 });
  }
} 