import mongoose from 'mongoose';

const FertilizerRecSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cropName: { type: String, required: true },
  area: { type: Number, required: true },
  soilType: { type: String, required: true },
  season: { type: String, required: true },
  stage: { type: String, required: true },
  recommendation: {
    urea: { type: Number, required: true },
    dap: { type: Number, required: true },
    potash: { type: Number, required: true },
    micronutrients: { type: String, required: true },
    schedule: [{ type: String }]
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const FertilizerRec = mongoose.model('FertilizerRec', FertilizerRecSchema);
