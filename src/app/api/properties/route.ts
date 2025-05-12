import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';

function isValidatorError(err: unknown): err is mongoose.Error.ValidatorError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message?: unknown }).message === 'string'
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const propertyData = await req.json();
    console.log('API RECEIVED:', JSON.stringify(propertyData, null, 2));

    // Remove _id if it's empty or invalid
    if (propertyData._id === '' || !mongoose.Types.ObjectId.isValid(propertyData._id)) {
      delete propertyData._id;
    }

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'type',
      'propertyCategory',
      'location',
      'area',
      'reference',
      'zoneName',
      'dldPermit'
    ];
    if (propertyData.type === 'off-plan') {
      requiredFields.push('minPrice', 'maxPrice');
    } else {
      requiredFields.push('price');
    if (propertyData.type === 'buy') {
      requiredFields.push('furnishing');
      }
    }

    const missingFields = requiredFields.filter(field => !propertyData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new property
    const property = await Property.create(propertyData);
    console.log('Created property:', property);

    return NextResponse.json(property, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating property:', error);
    
    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as mongoose.Error.ValidationError).errors)
        .map((err) => isValidatorError(err) ? err.message : String(err));
      return NextResponse.json(
        { message: 'Validation error', errors: validationErrors },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: 'A property with this reference number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const query = type ? { type } : {};

    const properties = await Property.find(query).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error: unknown) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 