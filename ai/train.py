import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import os
import cv2
import numpy as np
import json

CLASSES = [
    "Wheat_Healthy", "Wheat_YellowRust", "Wheat_BrownRust",
    "Tomato_Healthy", "Tomato_EarlyBlight", "Tomato_LateBlight",
    "Chickpea_Healthy", "Chickpea_Wilt", "Chickpea_PodBorer",
    "Soybean_Healthy", "Soybean_YellowMosaic", "Soybean_LeafSpot"
]

def extract_features(img_path):
    """
    Extracts an 8D hybrid feature vector:
    [mean_H, mean_S, mean_V, std_H, std_S, std_V, solidity, aspect_ratio]
    Combines HSV color metrics with contour solidity & aspect ratio.
    """
    img = cv2.imread(img_path)
    if img is None:
        return None
    
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Generate plant mask to ignore background (soil/noise)
    lower_plant = np.array([2, 15, 15])
    upper_plant = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower_plant, upper_plant)
    
    # Extract pixels belonging to the leaf
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

def train_classifier(data_dir="dataset"):
    """
    Trains a KNN classifier by extracting features from all training images
    and saving the database to a JSON file.
    """
    print("Training KNN Leaf Disease Classifier...")
    train_dir = os.path.join(data_dir, "train")
    
    if not os.path.exists(train_dir):
        print(f"Train directory '{train_dir}' not found. Run generate_data.py first.")
        return
        
    model_db = []
    
    for cls in CLASSES:
        cls_dir = os.path.join(train_dir, cls)
        if not os.path.isdir(cls_dir):
            continue
            
        print(f"Extracting features for class: {cls}")
        for filename in os.listdir(cls_dir):
            if filename.endswith(".jpg") or filename.endswith(".png"):
                img_path = os.path.join(cls_dir, filename)
                features = extract_features(img_path)
                if features is not None:
                    model_db.append({
                        "features": features,
                        "label": cls
                    })
                    
    # Save Model Weights/Database
    model_path = "trained_classifier.json"
    with open(model_path, "w") as f:
        json.dump(model_db, f, indent=2)
        
    print(f"Model saved successfully to {model_path} with {len(model_db)} samples.")
    
    # Evaluate Validation Accuracy
    val_dir = os.path.join(data_dir, "val")
    if os.path.exists(val_dir):
        correct = 0
        total = 0
        for cls in CLASSES:
            cls_dir = os.path.join(val_dir, cls)
            if not os.path.isdir(cls_dir):
                continue
            for filename in os.listdir(cls_dir):
                img_path = os.path.join(cls_dir, filename)
                features = extract_features(img_path)
                if features is not None:
                    # Run KNN prediction (K=3)
                    pred = predict_knn(features, model_db, k=3)
                    if pred == cls:
                        correct += 1
                    total += 1
        
        acc = (correct / total) * 100 if total > 0 else 0
        print(f"Validation Evaluation: {correct}/{total} correct ({acc:.2f}% Accuracy)")

def predict_knn(query_features, model_db, k=3):
    """
    K-Nearest Neighbors inference in pure Python/NumPy.
    """
    distances = []
    q = np.array(query_features)
    
    for item in model_db:
        f = np.array(item["features"])
        # Euclidean distance
        dist = np.linalg.norm(q - f)
        distances.append((dist, item["label"]))
        
    # Sort by distance
    distances.sort(key=lambda x: x[0])
    
    # Get top K labels
    top_k = [label for _, label in distances[:k]]
    
    # Return majority vote
    return max(set(top_k), key=top_k.count)

if __name__ == "__main__":
    train_classifier()
