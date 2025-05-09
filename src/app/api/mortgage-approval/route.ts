import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const MortgageApprovalSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  message: String,
  calculatorValues: {
    purchasePrice: Number,
    downPayment: Number,
    loanPeriod: Number,
    interestRate: Number,
    monthlyRepayment: Number
  }
}, { timestamps: true, collection: 'mortgageapprovals' });

const MortgageApproval = mongoose.models.MortgageApproval || mongoose.model('MortgageApproval', MortgageApprovalSchema);

export async function POST(request: Request) {
  try {
    console.log('Starting mortgage approval submission...');
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Parse request body
    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, email, mobile, message, calculatorValues } = body;

    // Validate required fields
    if (!name || !email || !mobile) {
      console.log('Missing required fields:', { name, email, mobile });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create submission
    console.log('Creating submission...');
    const submission = await MortgageApproval.create({
      name,
      email,
      mobile,
      message,
      calculatorValues
    });
    console.log('Submission created successfully:', submission);

    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    );
  } catch (error) {
    console.error('Detailed error in mortgage approval submission:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to save form submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 