import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BrochureRequest from '@/models/BrochureRequest';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, phone, propertyTitle } = await req.json();
    if (!name || !email || !phone || !propertyTitle) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    const request = await BrochureRequest.create({ name, email, phone, propertyTitle });
    return NextResponse.json({ message: 'Request saved', request }, { status: 201 });
  } catch (error) {
    console.error('Error saving brochure request:', error);
    return NextResponse.json({ message: 'Failed to save request.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const requests = await BrochureRequest.find().sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching brochure requests:', error);
    return NextResponse.json({ message: 'Failed to fetch requests.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Missing id.' }, { status: 400 });
    }
    const result = await BrochureRequest.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ message: 'Request not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting brochure request:', error);
    return NextResponse.json({ message: 'Failed to delete request.' }, { status: 500 });
  }
} 