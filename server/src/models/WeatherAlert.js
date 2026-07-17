import mongoose from 'mongoose';

const WeatherAlertSchema = new mongoose.Schema({
  type: { type: String, enum: ['info', 'warning', 'danger'], required: true },
  message: { type: String, required: true },
  messageBundeli: { type: String, required: true },
  active: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const WeatherAlert = mongoose.model('WeatherAlert', WeatherAlertSchema);
