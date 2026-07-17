import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  district: { type: String, required: true },
  language: { type: String, enum: ['Bundeli', 'Hindi', 'English'], default: 'Bundeli' },
  preferredCrops: [{ type: String }],
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
