import os
import cv2
import numpy as np
import random

CLASSES = [
    "Wheat_Healthy", "Wheat_YellowRust", "Wheat_BrownRust",
    "Tomato_Healthy", "Tomato_EarlyBlight", "Tomato_LateBlight",
    "Chickpea_Healthy", "Chickpea_Wilt", "Chickpea_PodBorer",
    "Soybean_Healthy", "Soybean_YellowMosaic", "Soybean_LeafSpot"
]

def draw_leaf_base(img, center, axes, angle, crop_type):
    """
    Draws a basic leaf silhouette based on the crop type.
    """
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    
    if crop_type == 'Wheat':
        # Long, narrow wheat leaves
        cv2.ellipse(mask, center, (axes[0] * 3, axes[1] // 3), angle, 0, 360, 255, -1)
    elif crop_type == 'Tomato':
        # Serrated compound-like leaf contour
        cv2.ellipse(mask, center, axes, angle, 0, 360, 255, -1)
        # Add jagged edges
        for i in range(0, 360, 30):
            rad = np.deg2rad(i + angle)
            pt = (int(center[0] + axes[0] * np.cos(rad) * 1.1), 
                  int(center[1] + axes[1] * np.sin(rad) * 1.1))
            cv2.line(mask, center, pt, 255, 4)
    elif crop_type == 'Chickpea':
        # Small leaflets
        for dx, dy in [(-30, -30), (0, -40), (30, -30), (-20, 0), (20, 0)]:
            cv2.ellipse(mask, (center[0] + dx, center[1] + dy), (axes[0] // 3, axes[1] // 3), angle + dx, 0, 360, 255, -1)
    else:
        # Soybean - broad ovals
        cv2.ellipse(mask, center, axes, angle, 0, 360, 255, -1)
        
    return mask

def generate_synthetic_image(cls_name, filename):
    # Create background (simulating soil or dry leaves)
    img = np.zeros((224, 224, 3), dtype=np.uint8)
    # Random earth-toned background noise
    bg_r = random.randint(180, 210)
    bg_g = random.randint(160, 185)
    bg_b = random.randint(130, 155)
    img[:] = [bg_b, bg_g, bg_r]
    
    # Randomize leaf parameters
    center = (112 + random.randint(-10, 10), 112 + random.randint(-10, 10))
    axes = (60 + random.randint(-5, 10), 40 + random.randint(-5, 10))
    angle = random.randint(0, 180)
    
    crop_type, disease = cls_name.split('_')
    
    # Generate leaf mask
    mask = draw_leaf_base(img, center, axes, angle, crop_type)
    
    # Color definition based on crop state
    if disease == 'Healthy':
        # Vibrant green leaf
        leaf_color = (random.randint(30, 50), random.randint(120, 170), random.randint(40, 75))
    elif disease == 'Wilt':
        # Dried yellowing/brown wilting leaf
        leaf_color = (random.randint(20, 45), random.randint(70, 95), random.randint(90, 130))
    elif disease == 'YellowRust' or disease == 'YellowMosaic':
        # Mostly yellow-green variegated leaf
        leaf_color = (random.randint(20, 50), random.randint(140, 210), random.randint(150, 220))
    else:
        # Diseased - yellowish base with brown lesions
        leaf_color = (random.randint(30, 60), random.randint(110, 140), random.randint(70, 110))
        
    # Draw leaf body on background using mask
    img[mask > 0] = leaf_color
    
    # 5. Add Disease markings/spots inside the leaf boundary
    leaf_indices = np.argwhere(mask > 0)
    if len(leaf_indices) > 0:
        if disease == 'YellowRust':
            # Yellow rust stripes on wheat
            for _ in range(random.randint(15, 30)):
                idx = random.choice(leaf_indices)
                cv2.line(img, (idx[1]-4, idx[0]-4), (idx[1]+4, idx[0]+4), (20, 200, 230), 2)
        elif disease == 'BrownRust' or disease == 'LeafSpot':
            # Brown pustules/spots
            for _ in range(random.randint(20, 40)):
                idx = random.choice(leaf_indices)
                cv2.circle(img, (idx[1], idx[0]), random.randint(1, 3), (15, 45, 80), -1)
        elif disease == 'EarlyBlight':
            # Early blight concentric circles (yellow halos with brown centers)
            for _ in range(random.randint(3, 7)):
                idx = random.choice(leaf_indices)
                cv2.circle(img, (idx[1], idx[0]), random.randint(6, 10), (20, 200, 210), -1) # Yellow halo
                cv2.circle(img, (idx[1], idx[0]), random.randint(3, 5), (10, 30, 60), -1)    # Brown center
        elif disease == 'LateBlight':
            # Late blight dark lesions on edges
            for _ in range(random.randint(4, 9)):
                idx = random.choice(leaf_indices)
                cv2.circle(img, (idx[1], idx[0]), random.randint(10, 18), (40, 50, 55), -1) # Dark gray lesions
        elif disease == 'PodBorer':
            # Leaf holes (replace green with background color)
            for _ in range(random.randint(3, 6)):
                idx = random.choice(leaf_indices)
                cv2.circle(img, (idx[1], idx[0]), random.randint(4, 8), (bg_b, bg_g, bg_r), -1) # Hole
                
    # Save image
    cv2.imwrite(filename, img)

def build_dataset(num_train=30, num_val=10):
    print("Generating synthetic crop leaf dataset...")
    base_dir = "dataset"
    for split in ['train', 'val']:
        count = num_train if split == 'train' else num_val
        for cls in CLASSES:
            folder_path = os.path.join(base_dir, split, cls)
            os.makedirs(folder_path, exist_ok=True)
            for i in range(count):
                filepath = os.path.join(folder_path, f"img_{i}.jpg")
                generate_synthetic_image(cls, filepath)
    print("Dataset generation complete!")

if __name__ == "__main__":
    build_dataset()
