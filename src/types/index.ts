export interface User {
  id: string;
  name: string;
  phone: string;
  district: string;
  language: 'Bundeli' | 'Hindi' | 'English';
  preferredCrops: string[];
  role: 'farmer' | 'admin';
  token?: string;
}

export interface DiseaseTreatment {
  medicine: string;
  dosage: string;
  schedule: string;
  precautions: string;
}

export interface DiseaseScanReport {
  id: string;
  userId: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  imageUrl: string;
  date: string;
  treatment: DiseaseTreatment;
  preventionTips: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: string;
}

export interface VoiceConversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  date: string;
  rating?: 'like' | 'dislike' | null;
}

export interface WeatherCondition {
  temp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
  conditionBundeli: string;
}

export interface ForecastDay {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  rainProb: number;
}

export interface WeatherAlert {
  id: string;
  type: 'info' | 'warning' | 'danger'; // Green, Yellow, Red
  message: string;
  messageBundeli: string;
  date: string;
  active: boolean;
}

export interface MandiPrice {
  id: string;
  cropName: string;
  district: string;
  mandiName: string;
  priceToday: number;
  priceYesterday: number;
  trend: 'up' | 'down' | 'stable';
  weeklyPrices: { date: string; price: number }[];
  averagePrice: number;
  nearbyMandis: { mandiName: string; price: number }[];
}

export interface FertilizerRecommendation {
  id: string;
  userId: string;
  cropName: string;
  area: number;
  soilType: string;
  season: string;
  stage: string;
  recommendation: {
    urea: number; // kg
    dap: number;  // kg
    potash: number; // kg
    micronutrients: string;
    schedule: string[];
  };
  date: string;
}

export interface BroadcastAdvisory {
  id: string;
  title: string;
  content: string;
  contentBundeli: string;
  category: 'weather' | 'pest' | 'general';
  date: string;
  sender: string;
}
