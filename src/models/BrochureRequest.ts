import mongoose from 'mongoose';

const BrochureRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertyTitle: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.BrochureRequest || mongoose.model('BrochureRequest', BrochureRequestSchema); 