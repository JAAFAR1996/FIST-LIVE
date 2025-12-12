import os
from rembg import remove
from PIL import Image

# Directories
base_dir = r"c:\Users\jaafa\Desktop\upload\FishWebClean\client\public"
output_dir = os.path.join(base_dir, "products", "transparent")
os.makedirs(output_dir, exist_ok=True)

# Map product ID to source relative path
product_map = {
    "fluval-407": "stock_images/fluval_407_canister__4d80d974.jpg",
    "aquaclear-70": "stock_images/aquaclear_70_power_f_dfd543e8.jpg",
    "seachem-prime": "stock_images/seachem_prime_500ml__b70abe42.jpg",
    "eheim-jager-200w": "stock_images/eheim_jager_aquarium_f65664bd.jpg",
    "anubias-nana": "stock_images/anubias_nana_aquariu_554af5dc.jpg",
    "wave-maker-6-port": "products/6-port-blue-201.jpg",
    "activated-carbon-500g": "products/activated-carbon-189.jpg",
    "water-test-kit": "products/9-in-one-water-quality-test-paper-aluminum-foil-bag-138.jpg"
}

def process_products():
    print("Starting product image processing...")
    for pid, rel_path in product_map.items():
        input_path = os.path.join(base_dir, rel_path)
        output_path = os.path.join(output_dir, f"{pid}.png")
        
        print(f"Processing {pid}...")
        try:
            if not os.path.exists(input_path):
                print(f"❌ Input file not found: {input_path}")
                continue
                
            with open(input_path, 'rb') as i:
                input_data = i.read()
                output_data = remove(input_data)
                
            with open(output_path, 'wb') as o:
                o.write(output_data)
            print(f"✓ Saved: {output_path}")
            
        except Exception as e:
            print(f"❌ Error processing {pid}: {e}")

if __name__ == "__main__":
    process_products()
