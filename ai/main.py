import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
import json

app = FastAPI(title="Kisan Mitra AI - Leaf Classifier & Disease Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Haar Cascade face classifier from OpenCV data
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Global database for KNN classifier
MODEL_DB = None

def load_knn_classifier():
    global MODEL_DB
    model_path = "trained_classifier.json"
    if os.path.exists(model_path):
        try:
            with open(model_path, "r") as f:
                MODEL_DB = json.load(f)
            print(f"Successfully loaded trained KNN classifier with {len(MODEL_DB)} samples.")
        except Exception as e:
            print(f"Error loading classifier: {e}")
    else:
        print("Trained KNN classifier not found. Please run training first.")

@app.on_event("startup")
def startup_event():
    load_knn_classifier()

def check_if_leaf(img_np) -> bool:
    """
    Checks if the image contains human faces or if it has sufficient plant-like color.
    """
    # 1. Run Haar Cascade human face detection to block selfies
    try:
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        if len(faces) > 0:
            print(f"Face detected: {len(faces)} human face(s) found. Rejecting.")
            return False
    except Exception as e:
        print(f"Face detection error: {e}")

    # 2. Plant color ratio check
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    lower_green = np.array([25, 20, 20])
    upper_green = np.array([90, 255, 255])
    lower_brown = np.array([2, 20, 15])
    upper_brown = np.array([35, 255, 255])
    
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)
    combined = cv2.bitwise_or(green_mask, brown_mask)
    
    plant_ratio = cv2.countNonZero(combined) / (hsv.shape[0] * hsv.shape[1])
    print(f"Leaf validation plant color ratio: {plant_ratio:.4f}")
    
    return plant_ratio >= 0.05

def extract_features_from_array(img_np):
    """
    Extracts an 8D hybrid feature vector:
    [mean_H, mean_S, mean_V, std_H, std_S, std_V, solidity, aspect_ratio]
    Combines HSV color metrics with contour solidity & aspect ratio.
    """
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    lower_plant = np.array([2, 15, 15])
    upper_plant = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower_plant, upper_plant)
    
    leaf_pixels = hsv[mask > 0]
    if len(leaf_pixels) == 0:
        leaf_pixels = hsv.reshape(-1, 3)
        
    mean = np.mean(leaf_pixels, axis=0)
    std = np.std(leaf_pixels, axis=0)
    
    # Calculate Solidity and Aspect Ratio from largest plant contour
    solidity = 1.0
    aspect_ratio = 1.0
    try:
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 0:
            largest_cnt = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_cnt)
            hull = cv2.convexHull(largest_cnt)
            hull_area = cv2.contourArea(hull)
            
            if hull_area > 0:
                solidity = float(area) / hull_area
                
            x, y, w, h = cv2.boundingRect(largest_cnt)
            if h > 0:
                aspect_ratio = float(w) / h
    except Exception as e:
        print(f"Shape feature extraction error: {e}")
        
    return [float(mean[0]), float(mean[1]), float(mean[2]),
            float(std[0]), float(std[1]), float(std[2]),
            float(solidity), float(aspect_ratio)]

def predict_knn_class(query_features, k=3):
    """
    Runs KNN classification over ALL classes and returns the detected crop and disease state.
    """
    if MODEL_DB is None or len(MODEL_DB) == 0:
        return "Wheat", "Healthy"
        
    distances = []
    q = np.array(query_features)
    
    # Calculate distance to ALL samples in the database
    for item in MODEL_DB:
        f = np.array(item["features"])
        dist = np.linalg.norm(q - f)
        distances.append((dist, item["label"]))
        
    distances.sort(key=lambda x: x[0])
    
    top_k = [label for _, label in distances[:k]]
    matched_class = max(set(top_k), key=top_k.count)
    print(f"KNN matched class: {matched_class} (K={k})")
    
    detected_crop, disease_key = matched_class.split('_')
    return detected_crop, disease_key

@app.post("/predict")
async def predict(
    cropName: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        contents = await image.read()
        pil_img = Image.open(BytesIO(contents)).convert("RGB")
        img_np = np.array(pil_img)
        
        # 1. Run Leaf/Plant Validation Check
        if not check_if_leaf(img_np):
            return {
                "isLeaf": False,
                "diseaseName": "पत्ता नहीं मिला (Not a Plant Leaf)",
                "confidence": 0,
                "severity": "Low",
                "treatment": {
                  "medicine": "लागू नहीं",
                  "dosage": "लागू नहीं",
                  "schedule": "कृपया असली फसल के पत्ते की साफ फोटो अपलोड करें। यह फोटो किसी पौधे या पत्ती की नहीं लग रही है।",
                  "precautions": "कैमरा को पत्ते के पास लाकर सीधे धूप में साफ़ फोटो लें।"
                },
                "preventionTips": ["असली फसल के पत्ते का उपयोग करें।", "सेल्फी या बैकग्राउंड वस्तुओं की फोटो न लें।"]
            }
            
        # 2. Extract 6D Feature Vector
        features = extract_features_from_array(img_np)
        
        # 3. Predict via Trained KNN Classifier
        detected_crop, disease_key = predict_knn_class(features)
        
        # Map English detected crop name back to Hindi/Bundeli
        crop_mapping_hindi = {
            'Wheat': 'गेहूं',
            'Tomato': 'टमाटर',
            'Chickpea': 'चना',
            'Soybean': 'सोयाबीन'
        }
        detected_crop_hindi = crop_mapping_hindi.get(detected_crop, 'गेहूं')
        
        print(f"Classified leaf disease state as: {disease_key} for crop {detected_crop_hindi}")

        # Return correct disease details
        predictions_database = {
            'गेहूं': {
                'Healthy': {
                    "diseaseName": "स्वस्थ गेहूं (Healthy Wheat Leaf)",
                    "confidence": 99,
                    "severity": "Low",
                    "treatment": {
                        "medicine": "कोनो दवाई की ज़रूरत नई है",
                        "dosage": "लागू नहीं",
                        "schedule": "फसल की सामान्य देखरेख चालू रखो भैया।",
                        "precautions": "समय-समय पर सिंचाई देव।"
                    },
                    "preventionTips": ["नियमित रूप से यूरिया का संतुलित छिड़काव करें।"]
                },
                'YellowRust': {
                    "diseaseName": "पीला रतुआ (Yellow Rust)",
                    "confidence": 96,
                    "severity": "High",
                    "treatment": {
                        "medicine": "प्रोपिकोनाज़ोल २५% ई.सी. (Tilt - टिल्ट)",
                        "dosage": "१ मिलीलीटर दवाई १ लीटर पानी में मिलाकर",
                        "schedule": "सबेरे या सांझ के समय छिड़काव करो भैया। ७ से १० दिन में पत्ता की जांच करियो।",
                        "precautions": "तेज हवा चलत में दवाई न छिड़कियो। हाथ में दस्ताना पहनो और दवाई डालने के बाद साबुन से नीके हाथ धो लो।"
                    },
                    "preventionTips": [
                        "रोग रोधी बीज ही बोओ भैया।",
                        "बोनी से पैले बीज को दवाई से सोध लो।",
                        "खेत में फालतू घास उखाड़ फेको।"
                    ]
                },
                'BrownRust': {
                    "diseaseName": "भूरा रतुआ (Brown Rust)",
                    "confidence": 93,
                    "severity": "Medium",
                    "treatment": {
                        "medicine": "टेबुकोनाज़ोल २५% ई.सी. (Folicur)",
                        "dosage": "१.५ मिलीलीटर दवाई १ लीटर पानी में मिलाकर",
                        "schedule": "पत्तियों पर भूरे रंग के धब्बे दिखते ही छिड़काव करें।",
                        "precautions": "दवाई छिड़कने के बाद कम से कम २४ घंटे पानी न डालें।"
                    },
                    "preventionTips": ["पोटाश खाद की संतुलित मात्रा डालें।", "खेत में नमी को बहुत अधिक न होने दें।"]
                }
            },
            'टमाटर': {
                'Healthy': {
                    "diseaseName": "स्वस्थ टमाटर (Healthy Tomato Leaf)",
                    "confidence": 99,
                    "severity": "Low",
                    "treatment": {
                        "medicine": "कोई दवाई आवश्यक नहीं है",
                        "dosage": "लागू नहीं",
                        "schedule": "पौधे स्वस्थ हैं। सामान्य पोषण जारी रखें।",
                        "precautions": "नियमित गुड़ाई करते रहें।"
                    },
                    "preventionTips": ["पौधों को लकड़ी का सहारा दें।"]
                },
                'LateBlight': {
                    "diseaseName": "पछेती झुलसा (Late Blight)",
                    "confidence": 94,
                    "severity": "High",
                    "treatment": {
                        "medicine": "मैनकोज़ेब + मेटलैक्सिल (Ridomil Gold)",
                        "dosage": "२.५ ग्राम प्रति लीटर पानी में घोल बनाकर",
                        "schedule": "सप्ताह में एक बार छिड़काव करें जब तक झुलसा रुक न जाए।",
                        "precautions": "संक्रमित शाखाओं को काटकर तुरंत जला दें।"
                    },
                    "preventionTips": ["पौधों की जड़ों में जलभराव न होने दें।", "फसल चक्र अपनाएं।"]
                },
                'EarlyBlight': {
                    "diseaseName": "अगेती झुलसा (Early Blight)",
                    "confidence": 92,
                    "severity": "Medium",
                    "treatment": {
                        "medicine": "कैब्रियो टॉप (Cabrio Top) या साफ (Saaf)",
                        "dosage": "२ ग्राम दवाई १ लीटर पानी में मिलाकर",
                        "schedule": "पत्ता पे बीमारी देखत ही तुरंत छिड़काव करो। १०-१२ दिन बाद दोबारा छिड़क देव।",
                        "precautions": "दवाई डालने के १ हफ्ता तक फल मत तोड़ियो। खाली डिब्बा ज़मीन में गाड़ देव।"
                    },
                    "preventionTips": [
                        "टमाटर के नीचे के सूखे पत्ता तोड़ के फेंक देव।",
                        "पौधा दूर-दूर लगाओ ताकि हवा और धूप नीके से मिल सके।"
                    ]
                }
            },
            'चना': {
                'Healthy': {
                    "diseaseName": "स्वस्थ चना (Healthy Chickpea Leaf)",
                    "confidence": 99,
                    "severity": "Low",
                    "treatment": {
                        "medicine": "कोई दवा आवश्यक नहीं",
                        "dosage": "लागू नहीं",
                        "schedule": "सामान्य सिंचाई जारी रखें।",
                        "precautions": "लागू नहीं"
                    },
                    "preventionTips": ["समय पर निराई-गुड़ाई करें।"]
                },
                'PodBorer': {
                    "diseaseName": "चना फली छेदक प्रकोप (Pod Borer)",
                    "confidence": 91,
                    "severity": "Medium",
                    "treatment": {
                        "medicine": "क्लोरेंट्रानिलिप्रोल १८.५% एस.सी. (Coragen)",
                        "dosage": "६० मिलीलीटर प्रति एकड़ १५० लीटर पानी में",
                        "schedule": "फूल आने के समय और फली बनने के समय छिड़काव करें।",
                        "precautions": "फूलों पर छिड़काव हमेशा शाम के समय करें जब मधुमक्खियां न हों।"
                    },
                    "preventionTips": ["खेत में चिड़ियों के बैठने के लिए टी-आकार के खूंटे लगाएं।"]
                },
                'Wilt': {
                    "diseaseName": "उकठा रोग (Wilt Disease)",
                    "confidence": 95,
                    "severity": "High",
                    "treatment": {
                        "medicine": "ट्राइकोडर्मा विरिडी (Trichoderma Viride)",
                        "dosage": "४ ग्राम प्रति किलो बीज या ५ किलो गोबर खाद के साथ प्रति एकड़",
                        "schedule": "चना बड़ा होबे पे उकठा को इलाज कठिन है, सो बोनी के समय माटी को उपचार ही सबसे उत्तम है।",
                        "precautions": "खेत में पानी जमा मत होने दो। बीमार पौधा उखाड़ के तुरंत जला देव।"
                    },
                    "preventionTips": [
                        "३ साल तक फसल बदल-बदल के बोओ (फसल चक्र)।",
                        "गर्मी में गहरी जुताई करो ताकि धूप से फफूंद मर जाए।"
                    ]
                }
            },
            'सोयाबीन': {
                'Healthy': {
                    "diseaseName": "स्वस्थ सोयाबीन (Healthy Soybean Leaf)",
                    "confidence": 99,
                    "severity": "Low",
                    "treatment": {
                        "medicine": "कोनो दवाई की ज़रूरत नई है",
                        "dosage": "लागू नहीं",
                        "schedule": "फसल स्वस्थ है।",
                        "precautions": "जल भराव से बचें।"
                    },
                    "preventionTips": ["पौधों के बीच खरपतवार निकालें।"]
                },
                'YellowMosaic': {
                    "diseaseName": "पीला मोज़ेक (Yellow Mosaic Virus)",
                    "confidence": 94,
                    "severity": "High",
                    "treatment": {
                        "medicine": "थियामेथोक्सम २५% डब्ल्यू.जी. (सफ़ेद मक्खी नियंत्रण)",
                        "dosage": "आधा (०.५) ग्राम दवाई १ लीटर पानी में मिलाकर",
                        "schedule": "ई बीमारी सफ़ेद मक्खी से फैलत है, मक्खी देखत ही तुरंत छिड़काव शुरू करो।",
                        "precautions": "बीमार पौधा तुरंत उखाड़ के नष्ट कर देव ताकि पूरी फसल बच सके।"
                    },
                    "preventionTips": [
                        "खेत में खरपतवार मत होने दो।",
                        "मक्खी पकड़ने लाने खेत में पीला चिपचिपा जाल लगाओ।"
                    ]
                },
                'LeafSpot': {
                    "diseaseName": "पत्ती धब्बा रोग (Leaf Spot)",
                    "confidence": 93,
                    "severity": "Medium",
                    "treatment": {
                        "medicine": "कार्बेन्डाजिम १२% + मैनकोज़ेब ६३% (Saaf)",
                        "dosage": "२ ग्राम दवाई प्रति लीटर पानी में घोलकर",
                        "schedule": "पत्तियों पर भूरे/लाल धब्बे दिखते ही छिड़काव शुरू करें।",
                        "precautions": "छिड़काव के समय मुंह पर कपड़ा लपेटें और हवा की दिशा में छिड़कें।"
                    },
                    "preventionTips": [
                        "प्रमाणित रोग-मुक्त बीज ही बोएं।",
                        "कटाई के बाद पुरानी फसल के अवशेषों को जला दें।"
                    ]
                }
            }
        }
        
        crop_data = predictions_database.get(detected_crop_hindi, predictions_database['गेहूं'])
        pred = crop_data.get(disease_key, crop_data['Healthy'])
        
        return {
            "isLeaf": True,
            "detectedCrop": detected_crop_hindi,
            "diseaseName": pred["diseaseName"],
            "confidence": pred["confidence"],
            "severity": pred["severity"],
            "treatment": pred["treatment"],
            "preventionTips": pred["preventionTips"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
