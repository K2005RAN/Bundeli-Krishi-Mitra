import axios from 'axios';
import {
  User,
  DiseaseScanReport,
  DiseaseTreatment,
  VoiceConversation,
  WeatherCondition,
  ForecastDay,
  WeatherAlert,
  MandiPrice,
  FertilizerRecommendation,
  BroadcastAdvisory,
  Message
} from '../types';

// Helper to simulate slight API network latency
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// database service adapters
export const mockApi = {
  // --- AUTH SERVICES ---
  login: async (phone: string, role: 'farmer' | 'admin' = 'farmer'): Promise<User> => {
    try {
      const res = await api.post<User>('/auth/login', { phone, role });
      const user = { ...res.data, id: (res.data as any)._id || res.data.id };
      localStorage.setItem('km_current_user', JSON.stringify(user));
      return user;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  },

  register: async (name: string, phone: string, district: string, crops: string[]): Promise<User> => {
    try {
      const res = await api.post<User>('/auth/register', { name, phone, district, preferredCrops: crops });
      const user = { ...res.data, id: (res.data as any)._id || res.data.id };
      localStorage.setItem('km_current_user', JSON.stringify(user));
      return user;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('km_current_user');
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem('km_current_user');
  },

  updateProfile: async (user: User): Promise<User> => {
    const res = await api.put<User>('/auth/profile', {
      id: user.id,
      name: user.name,
      phone: user.phone,
      district: user.district,
      language: user.language,
      preferredCrops: user.preferredCrops
    });
    const updated = { ...res.data, id: (res.data as any)._id || res.data.id };
    localStorage.setItem('km_current_user', JSON.stringify(updated));
    return updated;
  },

  // --- DISEASE SCAN SERVICES ---
  predictDisease: async (imageFile: File | string, cropName: string): Promise<DiseaseScanReport> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';
    
    // Select predictions based on crop type
    const mockPredictions: Record<string, { diseaseName: string; confidence: number; severity: 'Low' | 'Medium' | 'High'; treatment: DiseaseTreatment; preventionTips: string[] }> = {
      'गेहूं': {
        diseaseName: 'पीला रतुआ (Yellow Rust)',
        confidence: 97,
        severity: 'High',
        treatment: {
          medicine: 'प्रोपिकोनाज़ोल २५% ई.सी. (Tilt - टिल्ट)',
          dosage: '१ मिलीलीटर दवाई १ लीटर पानी में मिलाकर',
          schedule: 'सबेरे या सांझ के समय छिड़काव करो भैया। ७ से १० दिन में पत्ता की जांच करियो।',
          precautions: 'तेज हवा चलत में दवाई न छिड़कियो। हाथ में दस्ताना पहनो और दवाई डालने के बाद साबुन से नीके हाथ धो लो।'
        },
        preventionTips: [
          'रोग रोधी बीज ही बोओ भैया।',
          'बोनी से पैले बीज को दवाई से नीके सोध (उपचार) लो।',
          'खेत की रोज निगरानी करो और फालतू घास उखाड़ फेको।'
        ]
      },
      'टमाटर': {
        diseaseName: 'अगेती झुलसा (Early Blight)',
        confidence: 94,
        severity: 'Medium',
        treatment: {
          medicine: 'कैब्रियो टॉप (Cabrio Top) या साफ (Saaf)',
          dosage: '२ ग्राम दवाई १ लीटर पानी में मिलाकर',
          schedule: 'पत्ता पे बीमारी देखत ही तुरंत छिड़काव करो। १०-१२ दिन बाद दोबारा छिड़क देव।',
          precautions: 'दवाई डालने के १ हफ्ता तक फल मत तोड़ियो। खाली डिब्बा ज़मीन में गाड़ देव।'
        },
        preventionTips: [
          'टमाटर के नीचे के सूखे पत्ता तोड़ के फेंक देव।',
          'पौधा दूर-दूर लगाओ ताकि हवा और धूप नीके से मिल सके।'
        ]
      },
      'चना': {
        diseaseName: 'उकठा रोग (Wilt Disease)',
        confidence: 88,
        severity: 'High',
        treatment: {
          medicine: 'ट्राइकोडर्मा विरिडी (Trichoderma Viride)',
          dosage: '४ ग्राम प्रति किलो बीज (बोनी से पैले) या ५ किलो गोबर खाद के साथ प्रति एकड़',
          schedule: 'चना बड़ा होबे पे उकठा को इलाज कठिन है, सो बोनी के समय माटी को उपचार ही सबसे उत्तम है।',
          precautions: 'खेत में पानी जमा मत होने दो। बीमार पौधा उखाड़ के तुरंत जला देव।'
        },
        preventionTips: [
          '३ साल तक फसल बदल-बदल के बोओ (फसल चक्र)।',
          'गर्मी में गहरी जुताई करो ताकि धूप से फफूंद मर जाए।'
        ]
      },
      'सोयाबीन': {
        diseaseName: 'पीला मोज़ेक (Yellow Mosaic Virus)',
        confidence: 92,
        severity: 'High',
        treatment: {
          medicine: 'थियामेथोक्सम २५% डब्ल्यू.जी. (सफ़ेद मक्खी नियंत्रण)',
          dosage: 'आधा (०.५) ग्राम दवाई १ लीटर पानी में मिलाकर',
          schedule: 'ई बीमारी सफ़ेद मक्खी से फैलत है, मक्खी देखत ही तुरंत छिड़काव शुरू करो।',
          precautions: 'बीमार पौधा तुरंत उखाड़ के नष्ट कर देव ताकि पूरी फसल बच सके।'
        },
        preventionTips: [
          'खेत में खरपतवार मत होने दो।',
          'मक्खी पकड़ने लाने खेत में पीला चिपचिपा जाल (Yellow Sticky Traps) लगाओ।'
        ]
      }
    };

    const pred = mockPredictions[cropName] || {
      diseaseName: 'स्वस्थ पत्ता (Healthy Crop)',
      confidence: 99,
      severity: 'Low',
      treatment: {
        medicine: 'कोनो दवाई की ज़रूरत नई है',
        dosage: 'लागू नहीं',
        schedule: 'फसल की सामान्य देखरेख चालू रखो भैया।',
        precautions: 'उचित मात्रा में पानी और पोषक तत्व देत रहियो।'
      },
      preventionTips: [
        'समय पर निराई-गुड़ाई करत रहियो।',
        'संतुलित मात्रा में खाद डालो।'
      ]
    };

    let base64String = '';
    if (typeof imageFile === 'string') {
      base64String = imageFile;
    } else {
      base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    try {
      const res = await api.post<DiseaseScanReport>('/disease/predict', {
        userId,
        cropName,
        imageBase64: base64String
      });
      return { ...res.data, id: (res.data as any)._id || res.data.id };
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.error === 'NOT_A_LEAF') {
          throw new Error('NOT_A_LEAF');
        }
        if (err.response.data.error === 'CROP_MISMATCH') {
          throw new Error(`CROP_MISMATCH:${err.response.data.message}`);
        }
      }
      throw err;
    }
  },

  getDiseaseHistory: async (): Promise<DiseaseScanReport[]> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';
    const res = await api.get<DiseaseScanReport[]>(`/disease/history/${userId}`);
    return res.data.map(item => ({ ...item, id: (item as any)._id || item.id }));
  },

  // --- BUNDELI VOICE ASSISTANT ---
  sendVoiceChat: async (conversationId: string | null, textInput: string): Promise<{ conversation: VoiceConversation; replyText: string }> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';
    
    const res = await api.post<{ conversation: VoiceConversation; replyText: string }>('/voice/chat', {
      conversationId,
      userId,
      textInput
    });
    
    const conversation = {
      ...res.data.conversation,
      id: (res.data.conversation as any)._id || res.data.conversation.id
    };
    
    return { conversation, replyText: res.data.replyText };
  },

  getVoiceConversations: async (): Promise<VoiceConversation[]> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';
    const res = await api.get<VoiceConversation[]>(`/voice/history/${userId}`);
    return res.data.map(c => ({ ...c, id: (c as any)._id || c.id }));
  },

  rateVoiceChat: async (chatId: string, rating: 'like' | 'dislike' | null) => {
    await api.post(`/voice/rate/${chatId}`, { rating });
  },

  // --- WEATHER SERVICES ---
  getWeatherAlerts: async (): Promise<WeatherAlert[]> => {
    const res = await api.get<WeatherAlert[]>('/weather/alerts');
    return res.data.map(a => ({ ...a, id: (a as any)._id || a.id }));
  },

  getWeatherCondition: async (district: string): Promise<{ current: WeatherCondition; forecast: ForecastDay[] }> => {
    // Generate temperature forecast variables dynamically based on location hash
    const hash = district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseTemp = 28 + (hash % 6);
    const humidity = 65 + (hash % 15);
    const rainProb = 10 + (hash % 80);

    const current: WeatherCondition = {
      temp: baseTemp,
      humidity,
      rainProb,
      windSpeed: 12 + (hash % 8),
      uvIndex: 5 + (hash % 5),
      condition: rainProb > 50 ? 'हल्की बारिश' : rainProb > 30 ? 'आंशिक बादल' : 'धूप खिली है',
      conditionBundeli: rainProb > 50 ? 'पानी बरस सकत है' : rainProb > 30 ? 'बादल छाए हैं' : 'धूप कड़क है'
    };

    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const todayIndex = new Date().getDay();

    const forecast: ForecastDay[] = Array.from({ length: 7 }).map((_, i) => {
      const dayName = days[(todayIndex + i) % 7];
      const tempMax = baseTemp + Math.sin(i) * 2;
      const tempMin = baseTemp - 5 + Math.cos(i) * 2;
      return {
        day: dayName,
        tempMax: Math.round(tempMax),
        tempMin: Math.round(tempMin),
        condition: (rainProb + i * 5) % 100 > 60 ? 'बारिश' : (rainProb + i * 5) % 100 > 30 ? 'बादल' : 'साफ मौसम',
        rainProb: (rainProb + i * 7) % 100
      };
    });

    return { current, forecast };
  },

  // --- MANDI PRICES SERVICES ---
  getMandiPrices: async (): Promise<MandiPrice[]> => {
    const res = await api.get<MandiPrice[]>('/mandi/prices');
    return res.data.map(p => ({ ...p, id: (p as any)._id || p.id }));
  },

  getFavoriteCrops: (): string[] => {
    return JSON.parse(localStorage.getItem('km_favorite_crops') || '["गेहूं (Sarbati)"]');
  },

  toggleFavoriteCrop: (cropName: string): string[] => {
    let favs: string[] = JSON.parse(localStorage.getItem('km_favorite_crops') || '[]');
    if (favs.includes(cropName)) {
      favs = favs.filter((f) => f !== cropName);
    } else {
      favs.push(cropName);
    }
    localStorage.setItem('km_favorite_crops', JSON.stringify(favs));
    return favs;
  },

  // --- FERTILIZER SERVICES ---
  calculateFertilizer: async (
    cropName: string,
    area: number,
    soilType: string,
    season: string,
    stage: string
  ): Promise<FertilizerRecommendation> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';

    let ureaBase = 80;
    let dapBase = 50;
    let potashBase = 20;
    let micronutrients = 'जिंक सल्फेट: ५ किलोग्राम प्रति एकड़ मिट्टी में डालें';

    if (cropName.includes('गेहूं')) {
      ureaBase = 75;
      dapBase = 50;
      potashBase = 20;
      micronutrients = 'जिंक सल्फेट (२१%): १० किलोग्राम प्रति एकड़ बुवाई के समय डालें।';
    } else if (cropName.includes('चना')) {
      ureaBase = 15;
      dapBase = 40;
      potashBase = 15;
      micronutrients = 'अमोनियम मोलिब्डेट: ५० ग्राम प्रति एकड़ बीज उपचार में उपयोग करें।';
    } else if (cropName.includes('सोयाबीन')) {
      ureaBase = 20;
      dapBase = 50;
      potashBase = 25;
      micronutrients = 'सल्फर (गंधक): १० किलोग्राम प्रति एकड़ बुवाई के समय डालें।';
    } else if (cropName.includes('टमाटर')) {
      ureaBase = 60;
      dapBase = 60;
      potashBase = 40;
      micronutrients = 'बोरॉन: १ ग्राम प्रति लीटर पानी में मिलाकर फूलों के समय छिड़काव करें।';
    }

    const urea = Math.round(ureaBase * area);
    const dap = Math.round(dapBase * area);
    const potash = Math.round(potashBase * area);

    const schedule = [
      `बुवाई/रोपाई से पहले (आधार खाद): पूरे खेत में ${dap} किग्रा DAP, ${potash} किग्रा पोटाश और यूरिया की १/३ मात्रा का छिड़काव करें।`,
      `प्रथम सिंचाई/खड़ी फसल (२१-२५ दिन): यूरिया की १/३ मात्रा (${Math.round(urea / 2)} किग्रा) का छिड़काव करें।`,
      `फूल आने/वानस्पतिक वृद्धि (४०-४५ दिन): शेष १/३ मात्रा यूरिया का छिड़काव करें और सूक्ष्म पोषक तत्वों का छिड़काव पत्तियों पर करें।`
    ];

    const recommendation = {
      urea,
      dap,
      potash,
      micronutrients,
      schedule
    };

    const res = await api.post<FertilizerRecommendation>('/fertilizer/calculate', {
      userId,
      cropName,
      area,
      soilType,
      season,
      stage,
      recommendation
    });

    return { ...res.data, id: (res.data as any)._id || res.data.id };
  },

  getFertilizerHistory: async (): Promise<FertilizerRecommendation[]> => {
    const user = mockApi.getCurrentUser();
    const userId = user?.id || (user as any)?._id || 'u1';
    const res = await api.get<FertilizerRecommendation[]>(`/fertilizer/history/${userId}`);
    return res.data.map(r => ({ ...r, id: (r as any)._id || r.id }));
  },

  // --- ADMIN SERVICES ---
  getUsersList: async (): Promise<User[]> => {
    const res = await api.get<User[]>('/auth/users');
    return res.data.map(u => ({ ...u, id: (u as any)._id || u.id }));
  },

  broadcastAdvisory: async (title: string, content: string, contentBundeli: string, category: 'weather' | 'pest' | 'general'): Promise<BroadcastAdvisory> => {
    const type = category === 'weather' ? 'danger' : category === 'pest' ? 'warning' : 'info';
    
    // Broadcast advisory is mapped to a WeatherAlert document in MongoDB Atlas
    const res = await api.post<WeatherAlert>('/weather/broadcast', {
      type,
      message: content,
      messageBundeli: contentBundeli
    });

    return {
      id: (res.data as any)._id || res.data.id,
      title,
      content,
      contentBundeli,
      category,
      date: res.data.date,
      sender: 'कृषि वैज्ञानिक'
    };
  },

  getAdvisories: async (): Promise<BroadcastAdvisory[]> => {
    const res = await api.get<WeatherAlert[]>('/weather/alerts');
    // Map alerts to advisory structure
    return res.data.map((alert: any) => ({
      id: alert._id || alert.id,
      title: alert.type === 'danger' ? 'मौसम चेतावनी' : alert.type === 'warning' ? 'कीट सूचना' : 'कृषि सलाह',
      content: alert.message,
      contentBundeli: alert.messageBundeli,
      category: alert.type === 'danger' ? 'weather' : alert.type === 'warning' ? 'pest' : 'general',
      date: alert.date,
      sender: 'कृषि वैज्ञानिक'
    }));
  },

  updateMandiPrice: async (id: string, price: number): Promise<MandiPrice> => {
    const res = await api.put<MandiPrice>(`/mandi/prices/${id}`, { price });
    return { ...res.data, id: (res.data as any)._id || res.data.id };
  }
};
