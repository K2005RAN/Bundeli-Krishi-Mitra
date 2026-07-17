import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  audioUrl: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const VoiceChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
  date: { type: Date, default: Date.now },
  rating: { type: String, enum: ['like', 'dislike', 'null'], default: 'null' }
}, { timestamps: true });

export const VoiceChat = mongoose.model('VoiceChat', VoiceChatSchema);
