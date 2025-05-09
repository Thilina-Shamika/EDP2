import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectName, propertyId, propertyType } = body;

    if (!name || !email || !phone || !propertyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mongoose = await connectDB();
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }

    const inquiry = {
      name,
      email,
      phone,
      projectName,
      propertyId,
      propertyType,
      status: 'new',
      createdAt: new Date(),
    };

    await mongoose.connection.db.collection('inquiries').insertOne(inquiry);

    return NextResponse.json(
      { message: 'Inquiry submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
} 