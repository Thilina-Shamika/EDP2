import mongoose from 'mongoose';

export interface IInquiry extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: mongoose.Types.ObjectId;
  type: 'general' | 'property' | 'mortgage';
  status: 'new' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  type: {
    type: String,
    enum: ['general', 'property', 'mortgage'],
    required: [true, 'Please specify the inquiry type'],
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed'],
    default: 'new',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema); 