import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from './db.js';

// Mongoose Models
import { User } from './models/User.js';
import { DiseaseScan } from './models/DiseaseScan.js';
import { VoiceChat } from './models/VoiceChat.js';
import { WeatherAlert } from './models/WeatherAlert.js';
import { MandiPrice } from './models/MandiPrice.js';
import { FertilizerRec } from './models/FertilizerRec.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Seed Initial Database if empty
const seedDatabase = async () => {
  try {
    const alertCount = await WeatherAlert.countDocuments();
    if (alertCount === 0) {
      await WeatherAlert.insertMany([
        {
          type: 'danger',
          message: 'भारी बारिश की चेतावनी! आगामी २४ घंटों में खेत में सिंचाई न करें और जल निकासी सुनिश्चित करें।',
          messageBundeli: 'भारी पानी बरसबे की चेतावनी! अगले २४ घंटा में खेतों में पानी लगानो बंद कर देव और निकासी को इंतज़ाम करो।',
          active: true
        },
        {
          type: 'warning',
          message: 'तेज़ हवाएँ चलने की संभावना है। फसल पर कीटनाशक दवाओं के छिड़काव को स्थगित करें।',
          messageBundeli: 'तेज हवा चलबे की आशंका है। फसल में दवाई को छिड़काव आज टाल देव।',
          active: true
        },
        {
          type: 'info',
          message: 'तापमान सामान्य से अधिक रहने की संभावना है। पकी फसलों की कटाई पूरी करें।',
          messageBundeli: 'धूप तेज रह सकत है। पकी फसलन की कटाई जल्दी निबटा लो।',
          active: true
        }
      ]);
      console.log('Seeded initial weather alerts.');
    }

    const priceCount = await MandiPrice.countDocuments();
    if (priceCount === 0) {
      await MandiPrice.insertMany([
        {
          cropName: 'गेहूं (Sarbati)',
          district: 'झाँसी',
          mandiName: 'झाँसी मुख्य मंडी',
          priceToday: 2450,
          priceYesterday: 2420,
          trend: 'up',
          weeklyPrices: [
            { date: '09/07', price: 2380 },
            { date: '10/07', price: 2400 },
            { date: '11/07', price: 2410 },
            { date: '12/07', price: 2400 },
            { date: '13/07', price: 2430 },
            { date: '14/07', price: 2420 },
            { date: '15/07', price: 2450 }
          ],
          averagePrice: 2415,
          nearbyMandis: [
            { mandiName: 'बबीना मंडी', price: 2430 },
            { mandiName: 'ललितपुर मंडी', price: 2465 }
          ]
        },
        {
          cropName: 'चना (Desi)',
          district: 'झाँसी',
          mandiName: 'झाँसी मुख्य मंडी',
          priceToday: 5120,
          priceYesterday: 5150,
          trend: 'down',
          weeklyPrices: [
            { date: '09/07', price: 5200 },
            { date: '10/07', price: 5180 },
            { date: '11/07', price: 5190 },
            { date: '12/07', price: 5160 },
            { date: '13/07', price: 5140 },
            { date: '14/07', price: 5150 },
            { date: '15/07', price: 5120 }
          ],
          averagePrice: 5160,
          nearbyMandis: [
            { mandiName: 'मऊरानीपुर मंडी', price: 5150 },
            { mandiName: 'टीकमगढ़ मंडी', price: 5100 }
          ]
        },
        {
          cropName: 'सोयाबीन (Yellow)',
          district: 'झाँसी',
          mandiName: 'झाँसी मुख्य मंडी',
          priceToday: 4560,
          priceYesterday: 4560,
          trend: 'stable',
          weeklyPrices: [
            { date: '09/07', price: 4500 },
            { date: '10/07', price: 4520 },
            { date: '11/07', price: 4540 },
            { date: '12/07', price: 4550 },
            { date: '13/07', price: 4570 },
            { date: '14/07', price: 4560 },
            { date: '15/07', price: 4560 }
          ],
          averagePrice: 4545,
          nearbyMandis: [
            { mandiName: 'ललितपुर मंडी', price: 4580 },
            { mandiName: 'उरई मंडी', price: 4520 }
          ]
        },
        {
          cropName: 'सरसों (Mustard)',
          district: 'टीकमगढ़',
          mandiName: 'टीकमगढ़ गल्ला मंडी',
          priceToday: 5650,
          priceYesterday: 5600,
          trend: 'up',
          weeklyPrices: [
            { date: '09/07', price: 5500 },
            { date: '10/07', price: 5520 },
            { date: '11/07', price: 5550 },
            { date: '12/07', price: 5580 },
            { date: '13/07', price: 5570 },
            { date: '14/07', price: 5600 },
            { date: '15/07', price: 5650 }
          ],
          averagePrice: 5567,
          nearbyMandis: [
            { mandiName: 'झाँसी मंडी', price: 5680 },
            { mandiName: 'छतरपुर मंडी', price: 5620 }
          ]
        },
        {
          cropName: 'टमाटर',
          district: 'सागर',
          mandiName: 'सागर सब्ज़ी मंडी',
          priceToday: 1800,
          priceYesterday: 1600,
          trend: 'up',
          weeklyPrices: [
            { date: '09/07', price: 1500 },
            { date: '10/07', price: 1550 },
            { date: '11/07', price: 1600 },
            { date: '12/07', price: 1580 },
            { date: '13/07', price: 1620 },
            { date: '14/07', price: 1600 },
            { date: '15/07', price: 1800 }
          ],
          averagePrice: 1607,
          nearbyMandis: [
            { mandiName: 'दमोह मंडी', price: 1750 },
            { mandiName: 'खुरई मंडी', price: 1850 }
          ]
        }
      ]);
      console.log('Seeded initial crop prices.');
    }
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
};

// Connect Database & Run Seed
connectDB().then(() => {
  seedDatabase();
});

// --- AUTH API ROUTES ---

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, role } = req.body;
    let dbUser = await User.findOne({ phone, role });
    
    if (!dbUser) {
      dbUser = new User({
        name: role === 'admin' ? 'डॉ. रविंद्र अहिरवार' : 'नया किसान भाई',
        phone,
        district: 'झाँसी',
        language: role === 'admin' ? 'Hindi' : 'Bundeli',
        preferredCrops: role === 'admin' ? [] : ['गेहूं'],
        role
      });
      await dbUser.save();
    }
    
    res.json(dbUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, district, preferredCrops } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: 'यह मोबाइल नंबर पहले से पंजीकृत है!' });
    }
    
    const newUser = new User({
      name,
      phone,
      district,
      preferredCrops,
      language: 'Bundeli',
      role: 'farmer'
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  try {
    const { id, name, phone, district, language, preferredCrops } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { name, phone, district, language, preferredCrops },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DISEASE SCAN API ROUTES ---

app.post('/api/disease/predict', async (req, res) => {
  try {
    const { userId, cropName, imageBase64 } = req.body;
    
    // 1. Convert base64 data to buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 2. Build Multipart FormData for Python FastAPI
    const formData = new global.FormData();
    formData.append('cropName', cropName);
    
    const blob = new global.Blob([buffer], { type: 'image/jpeg' });
    formData.append('image', blob, 'leaf.jpg');
    
    // 3. Query FastAPI Python server
    const apiRes = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: formData
    });
    
    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`FastAPI Error: ${errText}`);
    }
    
    const aiResult = await apiRes.json();
    
    // 4. Check if it is a valid leaf image
    if (!aiResult.isLeaf) {
      return res.status(400).json({
        error: 'NOT_A_LEAF',
        message: aiResult.treatment.schedule
      });
    }

    // 5. Save the diagnostic scan to MongoDB Atlas
    const newScan = new DiseaseScan({
      userId,
      cropName: cropName,
      diseaseName: aiResult.diseaseName,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      imageUrl: imageBase64, // persist the captured leaf base64 to Atlas
      treatment: aiResult.treatment,
      preventionTips: aiResult.preventionTips
    });
    
    await newScan.save();
    res.status(201).json(newScan);
  } catch (error) {
    console.error("Predict endpoint error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/disease/history/:userId', async (req, res) => {
  try {
    const history = await DiseaseScan.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- VOICE ASSISTANT API ROUTES ---

app.get('/api/voice/history/:userId', async (req, res) => {
  try {
    const history = await VoiceChat.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/voice/chat', async (req, res) => {
  try {
    const { conversationId, userId, textInput } = req.body;
    let chat;
    if (conversationId) {
      chat = await VoiceChat.findById(conversationId);
    }

    if (!chat) {
      chat = new VoiceChat({
        userId,
        title: textInput.substring(0, 20) + '...',
        messages: []
      });
    }

    chat.messages.push({
      sender: 'user',
      text: textInput
    });

    // Bundeli reply logic using Gemini API
    let replyText = '';
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `You are "Bundeli Krishi Mitra", an expert agricultural advisor from the Bundelkhand region in India.
      Speak entirely in the Bundeli dialect (written in Devanagari script). Be friendly, helpful, and address the user as 'भैया' (brother) or similar polite terms.
      Answer the following question about farming, crops, weather, or agriculture.
      Keep the response concise (2-4 sentences max).

      User's question: "${textInput}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      replyText = response.text() || 'राम राम भैया! मोये कछु समझ नईं आओ, फिर से पूछ लो।';
    } catch (aiError) {
      console.error('Gemini API Error:', aiError);
      
      // Expanded Fallback offline AI mechanism when API key is rate limited or unavailable
      const lowerInput = textInput.toLowerCase();
      if (lowerInput.includes('टमाटर') || lowerInput.includes('tomato')) {
        replyText = 'राम-राम भैया! टमाटर की खेती करवे के लानें सबसें पैलें दोमट मट्टी वारो खेत बढ़िया जुतवा लो और ओमें गोबर की खाद मिला देव। फिर नर्सरी में पौध तैयार करकें मेड़न पै रोपाई करियो।';
      } else if (lowerInput.includes('गेहूं') || lowerInput.includes('wheat')) {
        replyText = 'भैया, गेहूं बोवे के लाने खेत खों बढ़िया से तैयार कर लियो। समय पे पानी देत रहियो और यूरिया को छिड़काव जरूरत के हिसाब से करियो, पैदावार बहुत बढ़िया हुईहै।';
      } else if (lowerInput.includes('आलू') || lowerInput.includes('potato')) {
        replyText = 'राम राम भैया! आलू की बंपर पैदावार लाने खेत की गहरी जुताई कराओ। बलुई दोमट मट्टी सबसें अच्छी होत है, और बीज हमेशा रोग-मुक्त ही बोइयो।';
      } else if (lowerInput.includes('प्याज') || lowerInput.includes('लहसुन') || lowerInput.includes('onion') || lowerInput.includes('garlic')) {
        replyText = 'भैया जी, प्याज और लहसुन में पोटाश और सल्फर वारो खाद डारियो, कंद मोटो और बढ़िया हुईहै। खेत में पानी को भराव न होन दियो।';
      } else if (lowerInput.includes('चना') || lowerInput.includes('chana') || lowerInput.includes('chickpea')) {
        replyText = 'भैया, चना में इल्ली को प्रकोप जल्दी होत है। तनक खेत की निगरानी करत रहियो, और इल्ली दिखत ही नीम के तेल या उचित दवा को छिड़काव कर दियो।';
      } else if (lowerInput.includes('सोयाबीन') || lowerInput.includes('soyabean')) {
        replyText = 'सोयाबीन बोवे सेंग पैले बीज खों राइजोबियम कल्चर से उपचारित जरूर कर लियो भैया, इससे पैदावार अच्छी हुईहै और खाद की बचत भी हुईहै।';
      } else if (lowerInput.includes('कीट') || lowerInput.includes('बीमारी') || lowerInput.includes('रोग') || lowerInput.includes('pest') || lowerInput.includes('disease') || lowerInput.includes('इल्ली')) {
        replyText = 'फसल में अगर कोऊ बीमारी या कीड़ा लग रओ है, तो आप हमारो "पत्ता स्कैन" (Disease Detector) फीचर उपयोग कर सकत हो। बस खेत से पत्ता की फोटो खींच के डाल दियो, हम तुरंत दवा बता देहें!';
      } else if (lowerInput.includes('मौसम') || lowerInput.includes('weather') || lowerInput.includes('पानी') || lowerInput.includes('बारिश')) {
        replyText = 'भैया, मौसम को मिजाज तो बदलत रत है। तनक आसमान खों देखत रहियो, और अगर बादर दिखें तो फसल खों बचावे की व्यवस्था कर लियो।';
      } else if (lowerInput.includes('खाद') || lowerInput.includes('fertilizer') || lowerInput.includes('यूरिया')) {
        replyText = 'खेत में खाद डारवे सें पैले मट्टी की जाँच जरूर करा लइयो। गोबर की खाद सबसें बढ़िया होत है, और यूरिया को उपयोग तनक हिसाब सें करियो।';
      } else if (lowerInput.includes('मंडी') || lowerInput.includes('भाव') || lowerInput.includes('रेट') || lowerInput.includes('price')) {
        replyText = 'मंडी के भाव हर दिन बदलत रहत हैं भैया! आप ऐप में मंडी वाले पन्ने पै जाकें आज को ताज़ा भाव देख सकत हो।';
      } else {
        replyText = 'राम राम भैया! तोआरो सवाल हम सुन लओ है। हमारो गूगल ए.आई. सर्वर तनक धीमो चल रओ है या तोआरी लिमिट ख़तम हो गई है। पर खेती में मेहनत करत रओ, भगवान भली करैं!';
      }
    }

    chat.messages.push({
      sender: 'assistant',
      text: replyText
    });

    await chat.save();
    res.json({ conversation: chat, replyText });
  } catch (error) {
    res.status(550).json({ error: error.message });
  }
});

app.post('/api/voice/rate/:id', async (req, res) => {
  try {
    const { rating } = req.body;
    const chat = await VoiceChat.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );
    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- WEATHER ALERTS API ROUTES ---

app.get('/api/weather/alerts', async (req, res) => {
  try {
    const alerts = await WeatherAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/weather/broadcast', async (req, res) => {
  try {
    const { type, message, messageBundeli } = req.body;
    const newAlert = new WeatherAlert({
      type,
      message,
      messageBundeli,
      active: true
    });
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- MANDI PRICES API ROUTES ---

app.get('/api/mandi/prices', async (req, res) => {
  try {
    const prices = await MandiPrice.find().sort({ cropName: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/mandi/prices/:id', async (req, res) => {
  try {
    const { price } = req.body;
    const item = await MandiPrice.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'रिकॉर्ड नहीं मिला!' });
    }

    const prevPrice = item.priceToday;
    item.priceYesterday = prevPrice;
    item.priceToday = price;
    item.trend = price > prevPrice ? 'up' : price < prevPrice ? 'down' : 'stable';

    const todayStr = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: '2-digit' });
    item.weeklyPrices.push({ date: todayStr, price });
    if (item.weeklyPrices.length > 7) {
      item.weeklyPrices.shift();
    }
    item.averagePrice = Math.round(item.weeklyPrices.reduce((sum, wp) => sum + wp.price, 0) / item.weeklyPrices.length);

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- FERTILIZER API ROUTES ---

app.get('/api/fertilizer/history/:userId', async (req, res) => {
  try {
    const history = await FertilizerRec.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fertilizer/calculate', async (req, res) => {
  try {
    const { userId, cropName, area, soilType, season, stage, recommendation } = req.body;
    const newRec = new FertilizerRec({
      userId,
      cropName,
      area,
      soilType,
      season,
      stage,
      recommendation
    });
    await newRec.save();
    res.status(201).json(newRec);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
