import os
import requests
from dotenv import load_dotenv
import base64
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

# Get Stability API key from environment
STABILITY_API_KEY = os.getenv('STABILITY_API_KEY')
STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

def test_stability_api():
    """Simple test to check if Stability AI API is working"""
    
    # Test prompt
    prompt = "A beautiful sunset over mountains, photorealistic"
    
    # Request headers
    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    # Request payload
    payload = {
        "text_prompts": [
            {
                "text": prompt,
                "weight": 1
            }
        ],
        "cfg_scale": 7,
        "height": 512,  # Using smaller dimensions for testing
        "width": 512,   # Using smaller dimensions for testing
        "samples": 1,
        "steps": 30
    }
    
    print(f"Using API key: {STABILITY_API_KEY[:5]}...{STABILITY_API_KEY[-4:]}")
    print(f"Sending request to {STABILITY_API_URL}")
    
    try:
        # Make API request
        response = requests.post(STABILITY_API_URL, headers=headers, json=payload)
        
        # Print status code
        print(f"Status code: {response.status_code}")
        
        if response.status_code != 200:
            # Print error details
            print(f"Error: {response.text}")
            return False
        
        # Parse response
        data = response.json()
        
        # Check for artifacts
        if 'artifacts' in data and len(data['artifacts']) > 0:
            print("Image generated successfully!")
            
            # Decode and save image for verification
            image_base64 = data['artifacts'][0]['base64']
            image_data = base64.b64decode(image_base64)
            
            # Create an image from the bytes
            image = Image.open(io.BytesIO(image_data))
            
            # Save the image to disk
            image.save("test_image.png")
            print("Image saved as 'test_image.png'")
            return True
        else:
            print("No images in response")
            print(f"Full response: {data}")
            return False
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_stability_api()
