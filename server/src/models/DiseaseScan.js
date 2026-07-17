import mongoose from 'mongoose';

const DiseaseScanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cropName: { type: String, required: true },
  diseaseName: { type: String, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  imageUrl: { type: String, required: true },
  treatment: {
    medicine: { type: String },
    dosage: { type: String },
    schedule: { type: String },
    precautions: { type: String }
  },
  preventionTips: [{ type: String }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const DiseaseScan = mongoose.model('DiseaseScan', DiseaseScanSchema);
