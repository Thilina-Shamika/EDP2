import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the schema for listed properties
const listedPropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  listingType: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model if it doesn't exist
const ListedProperty = mongoose.models.ListedProperty || mongoose.model('ListedProperty', listedPropertySchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, listingType, propertyAddress } = body;

    // Validate required fields
    if (!name || !email || !mobile || !listingType || !propertyAddress) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create new listed property entry
    const listedProperty = new ListedProperty({
      name,
      email,
      mobile,
      listingType,
      propertyAddress
    });

    // Save to database
    await listedProperty.save();

    return NextResponse.json(
      { message: 'Property listing request submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in list-property API:', error);
    return NextResponse.json(
      { error: 'Failed to submit property listing request' },
      { status: 500 }
    );
  }
}

// GET handler to retrieve all listed properties
export async function GET() {
  try {
    await connectDB();
    const listedProperties = await ListedProperty.find().sort({ createdAt: -1 });
    return NextResponse.json(listedProperties);
  } catch (error) {
    console.error('Error fetching listed properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listed properties' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a listed property
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await ListedProperty.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Property listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Property listing deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting listed property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property listing' },
      { status: 500 }
    );
  }
} 