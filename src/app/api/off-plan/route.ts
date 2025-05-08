import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OffPlanProperty from '@/models/OffPlanProperty';

export async function GET() {
  try {
    await connectDB();
    // Fetch all properties (no filter)
    const properties = await OffPlanProperty.find({}).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching off-plan properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
} 