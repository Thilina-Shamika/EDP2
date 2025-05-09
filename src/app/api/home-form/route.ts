import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const HomeFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: String,
}, { timestamps: true, collection: 'homeforms' });

const HomeFormSubmission = mongoose.models.HomeFormSubmission || mongoose.model('HomeFormSubmission', HomeFormSchema);

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, phone, email, message } = body;
    
    if (!fullName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const submission = await HomeFormSubmission.create({ fullName, phone, email, message });
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error saving home form submission:', error);
    return NextResponse.json({ error: 'Failed to save form submission' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const submissions = await HomeFormSubmission.find().sort({ createdAt: -1 });
    console.log('Found submissions:', submissions); // Debug log
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching home form submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await HomeFormSubmission.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Submission deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting home form submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
} 