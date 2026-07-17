<div align="center">
  <img src="https://raw.githubusercontent.com/K2005RAN/Bundeli-Krishi-Mitra/main/public/logo.png" alt="Bundeli Krishi Mitra Logo" width="150" height="150" style="border-radius: 50%;">
  
  # 🌱 Bundeli Krishi Mitra (बुंदेली कृषि मित्र)
  
  **आपका अपना डिजिटल खेती सलाहकार**

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI">
    <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  </p>
</div>

---

## 🌟 Overview

**Bundeli Krishi Mitra** is an advanced, AI-powered agricultural advisory platform specifically designed for the farmers of the Bundelkhand region. Breaking the language barrier, the platform features a natively integrated **AI Voice Assistant** that communicates entirely in the local **Bundeli dialect**.

Coupled with a Deep Learning-based **Crop Disease Detector**, real-time **Mandi Prices**, and live **Weather Forecasts**, this application serves as a complete digital companion for modern rural farming.

---

## ✨ Key Features

- 🗣️ **Native Bundeli AI Voice Assistant:** Powered by Google Gemini AI and Web Speech API, allowing farmers to ask complex agricultural questions verbally in their local dialect and receive instantly synthesized vocal responses.
- 🍃 **Smart Crop Disease Detector:** A FastAPI + TensorFlow/OpenCV backend that analyzes photos of crop leaves (Wheat, Tomato, Potato, etc.) to detect diseases instantly and provide immediate remedies.
- 🌾 **Live Mandi Prices & Weather:** Real-time integration to give farmers the most accurate local market rates and weather forecasts to plan their harvests.
- 💧 **Smart Fertilizer Calculator:** Automated recommendations for Urea, Potash, and Phosphorus based on farm size and crop type.
- 📱 **Progressive Web App (PWA):** A hyper-responsive, rural-friendly UI designed for low-end mobile devices with slow internet connectivity.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js + TypeScript
- **Styling:** Tailwind CSS + Framer Motion (Micro-animations)
- **Voice Capabilities:** Native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### **Backend (Node.js)**
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB (User Profiles, History)
- **AI Integration:** Google Generative AI (`gemini-flash-latest`) + Offline Native Bundeli Fallback Engine

### **AI / ML Service (Python)**
- **Framework:** FastAPI + Uvicorn
- **Machine Learning:** TensorFlow / OpenCV / Pillow
- **Functionality:** Real-time Image processing and disease classification from user-uploaded images.

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/K2005RAN/Bundeli-Krishi-Mitra.git
cd Bundeli-Krishi-Mitra
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### 3. Node.js Backend Setup
```bash
# Open a new terminal and navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and add your Google Gemini API Key and MongoDB URI
# GEMINI_API_KEY=your_api_key_here
# MONGODB_URI=your_mongo_connection_string

# Start the backend server
npm run dev
```

### 4. Python AI Server Setup (For Disease Detection)
```bash
# Open a new terminal and navigate to the AI directory
cd ai

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python main.py
```

---

## 🏗️ System Architecture

1. **User interacts** with the React frontend (records voice or uploads a leaf image).
2. **Audio/Text** is sent to the Express `Node.js Backend` where it interfaces with **Google Gemini AI** to fetch conversational advice in Bundeli. If the API is rate-limited, an intelligent offline fallback immediately handles the query.
3. **Leaf Images** are proxied through the Express server directly into the **Python FastAPI Microservice**, which runs a deep learning classification and returns confidence-scored treatments.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  <i>Made with ❤️ for the farmers of India.</i>
</div>
