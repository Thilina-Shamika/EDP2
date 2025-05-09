import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  projectName: { type: String, required: true },
  propertyId: { type: String, required: true },
  propertyType: { type: String, required: true },
  status: { type: String, default: 'new' },
}, { timestamps: true, collection: 'inquiries' });

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, projectName, propertyId, propertyType, status } = body;
    
    if (!name || !email || !phone || !projectName || !propertyId || !propertyType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const inquiry = await Inquiry.create({ name, email, phone, projectName, propertyId, propertyType, status: status || 'new' });
    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
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
        { error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await Inquiry.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Inquiry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
} 