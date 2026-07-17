import mongoose from 'mongoose';

const WeeklyPriceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true }
});

const NearbyMandiSchema = new mongoose.Schema({
  mandiName: { type: String, required: true },
  price: { type: Number, required: true }
});

const MandiPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  district: { type: String, required: true },
  mandiName: { type: String, required: true },
  priceToday: { type: Number, required: true },
  priceYesterday: { type: Number, required: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  weeklyPrices: [WeeklyPriceSchema],
  averagePrice: { type: Number, required: true },
  nearbyMandis: [NearbyMandiSchema]
}, { timestamps: true });

export const MandiPrice = mongoose.model('MandiPrice', MandiPriceSchema);
