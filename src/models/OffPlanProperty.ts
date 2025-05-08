import mongoose from 'mongoose';

const OffPlanPropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
  handoverDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  beds: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'properties',
});

export default mongoose.models.OffPlanProperty || mongoose.model('OffPlanProperty', OffPlanPropertySchema); 