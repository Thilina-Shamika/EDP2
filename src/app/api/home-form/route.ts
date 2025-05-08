import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const HomeFormSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  purpose: String,
  message: String,
}, { timestamps: true, collection: 'homeforms' });

const HomeFormSubmission = mongoose.models.HomeFormSubmission || mongoose.model('HomeFormSubmission', HomeFormSchema);

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, phone, email, purpose, message } = body;
    if (!fullName || !phone || !email || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const submission = await HomeFormSubmission.create({ fullName, phone, email, purpose, message });
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error saving home form submission:', error);
    return NextResponse.json({ error: 'Failed to save form submission' }, { status: 500 });
  }
} 