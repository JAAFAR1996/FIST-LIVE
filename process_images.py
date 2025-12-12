import requests
from rembg import remove
from PIL import Image
import io
import os

# Ensure output directory exists
output_dir = r"c:\Users\jaafa\Desktop\upload\FishWebClean\client\public\fish"
os.makedirs(output_dir, exist_ok=True)

# Map of fish filenames to their High-Res Source URL
fish_images = {
    "neon-tetra": "https://commons.wikimedia.org/wiki/Special:FilePath/Neon_tetra.JPG",
    "betta-splendens": "https://commons.wikimedia.org/wiki/Special:FilePath/Betta-splendens-male.jpg",
    "guppy": "https://commons.wikimedia.org/wiki/Special:FilePath/Guppy-male.jpg",
    "angelfish": "https://commons.wikimedia.org/wiki/Special:FilePath/Pterophyllum_scalare_male.jpg",
    "corydoras-paleatus": "https://commons.wikimedia.org/wiki/Special:FilePath/Corydoras_paleatus.jpg",
    "goldfish": "https://commons.wikimedia.org/wiki/Special:FilePath/Goldfish.jpg",
    "platy": "https://commons.wikimedia.org/wiki/Special:FilePath/Platy_(fish).jpg",
    "cardinal-tetra": "https://commons.wikimedia.org/wiki/Special:FilePath/Paracheirodon_axelrodi.jpg",
    "molly": "https://commons.wikimedia.org/wiki/Special:FilePath/Poecilia_sphenops.jpg",
    "dwarf-gourami": "https://commons.wikimedia.org/wiki/Special:FilePath/Colisa_lalia.jpg",
    "black-skirt-tetra": "https://commons.wikimedia.org/wiki/Special:FilePath/BlackTetras.JPG",
    "swordtail": "https://commons.wikimedia.org/wiki/Special:FilePath/SwordtailFish.jpg",
    "zebra-danio": "https://commons.wikimedia.org/wiki/Special:FilePath/Zebrafisch.jpg",
    "tiger-barb": "https://commons.wikimedia.org/wiki/Special:FilePath/Tiger_Barb_700.jpg",
    "pearl-gourami": "https://commons.wikimedia.org/wiki/Special:FilePath/Pearl_Gourami.JPG",
    "bristlenose-pleco": "https://commons.wikimedia.org/wiki/Special:FilePath/Bristlenose_Pleco.jpg",
    "kuhli-loach": "https://commons.wikimedia.org/wiki/Special:FilePath/Kuhli_loach.JPG",
    "harlequin-rasbora": "https://commons.wikimedia.org/wiki/Special:FilePath/Harlequin_rasbora.jpg",
    "cherry-barb": "https://commons.wikimedia.org/wiki/Special:FilePath/Male_Cherry_Barb_700.jpg",
    "german-blue-ram": "https://commons.wikimedia.org/wiki/Special:FilePath/Mikrogeophagus_ramirezi.jpg",
    "otocinclus": "https://commons.wikimedia.org/wiki/Special:FilePath/Otocinclus_affinis.jpg",
    "discus": "https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Discus.jpg"
}

def process_image(name, url):
    print(f"Processing {name}...")
    try:
        # Download
        headers = {'User-Agent': 'Mozilla/5.0'} # Fake UA to avoid 403
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            # Remove background directly from bytes
            input_image = response.content
            output_image = remove(input_image)
            
            # Save
            output_path = os.path.join(output_dir, f"{name}.png")
            with open(output_path, 'wb') as f:
                f.write(output_image)
            print(f"✓ Saved: {output_path}")
        else:
            print(f"❌ Failed to download {url}: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Error processing {name}: {e}")

if __name__ == "__main__":
    print("Starting batch image processing...")
    for name, url in fish_images.items():
        process_image(name, url)
    print("Done!")
