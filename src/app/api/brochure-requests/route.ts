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