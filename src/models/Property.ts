import mongoose from 'mongoose';

export interface IProperty extends mongoose.Document {
  title: string;
  description: string;
  type: 'buy' | 'commercial' | 'off-plan';
  propertyCategory: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  features: string[];
  status: 'available' | 'sold' | 'pending';
  furnishing: string;
  reference: string;
  zoneName: string;
  dldPermit: string;
  qrCode?: string;
  pdf?: string;
  installment1?: string;
  installment2?: string;
  handoverDate?: string;
  masterDeveloper?: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  type: {
    type: String,
    enum: ['buy', 'commercial', 'off-plan'],
    required: [true, 'Please specify the property type'],
  },
  propertyCategory: {
    type: String,
    required: [true, 'Please specify the property category'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price'],
  },
  location: {
    type: String,
    required: [true, 'Please provide the location'],
  },
  bedrooms: {
    type: Number,
    min: 0,
  },
  bathrooms: {
    type: Number,
    min: 0,
  },
  area: {
    type: Number,
    required: [true, 'Please provide the area'],
  },
  images: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available',
  },
  furnishing: {
    type: String,
    required: function (this: { type?: string }) {
      return this.type === 'buy';
    },
  },
  reference: {
    type: String,
    required: [true, 'Please provide a reference number'],
  },
  zoneName: {
    type: String,
    required: [true, 'Please provide a zone name'],
  },
  dldPermit: {
    type: String,
    required: [true, 'Please provide a DLD permit number'],
  },
  qrCode: {
    type: String,
  },
  pdf: {
    type: String,
  },
  installment1: {
    type: String,
  },
  installment2: {
    type: String,
  },
  handoverDate: {
    type: String,
  },
  masterDeveloper: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema); 