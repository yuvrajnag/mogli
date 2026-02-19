from flask import Flask, request, jsonify, send_from_directory, Response
from huggingface_hub import InferenceClient
import io
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='assets-lg')

# API Keys from .env
HF_API_KEY = os.getenv("HF_API_KEY")

# Initialize Client
client = InferenceClient(model="stabilityai/stable-diffusion-3-medium-diffusers", token=HF_API_KEY)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/dashboard.html')
@app.route('/dashboard')
def dashboard_page():
    return send_from_directory('.', 'dashboard.html')

@app.route('/lg.html')
def lg_page():
    return send_from_directory('.', 'lg.html')

@app.route('/ng.html')
def ng_page():
    return send_from_directory('.', 'ng.html')

@app.route('/history')
def history_page():
    return send_from_directory('.', 'history.html')

@app.route('/projects')
def projects_page():
    return send_from_directory('.', 'projects.html')

@app.route('/spaces')
def spaces_page():
    return send_from_directory('.', 'placeholder.html')

@app.route('/assets-lg/<path:path>')
def send_assets(path):
    return send_from_directory('assets-lg', path)

@app.route('/generate-logo', methods=['POST'])
def generate_logo():
    try:
        data = request.json
        if data is None:
             return jsonify({"error": "Invalid JSON body or missing Content-Type header"}), 400
             
        prompt = data.get('prompt', '').strip()
        aspect_ratio = data.get('aspect_ratio', '1:1')

        if not prompt:
            return jsonify({"error": "Please provide a description for your logo."}), 400

        # Strict validation for logo keywords
        logo_keywords = ['logo', 'icon', 'symbol', 'emblem', 'badge', 'mark', 'brand', 'identity', 'logotype', 'monogram']
        if not any(keyword in prompt.lower() for keyword in logo_keywords):
             return jsonify({"error": "Please include 'logo', 'icon', or 'symbol' in your prompt to generate a logo."}), 400

        # Map Aspect Ratio to SDXL Optimal Resolutions
        # https://platform.stability.ai/docs/features/api-parameters#aspect-ratios
        RATIO_TO_SIZE = {
            "1:1": (1024, 1024),
            "16:9": (1344, 768),
            "9:16": (768, 1344),
            "2:3": (832, 1216),
            "3:4": (896, 1152),
            "1:2": (640, 1536), # Approx for vertical
            "2:1": (1536, 640), # Approx for horizontal
            "4:5": (896, 1120),
            "3:2": (1216, 832),
            "4:3": (1152, 896),
        }
        
        width, height = RATIO_TO_SIZE.get(aspect_ratio, (1024, 1024))

        # Enhance prompt
        enhanced_prompt = f"professional vector logo design, {prompt}, minimal, vector art, white background, centered, high quality"
        negative_prompt = "blurry, low quality, text, watermark, realistic, photo, 3d render, complex background, ui, interface, buttons, frames, borders"

        # Generate image using the client with dimensions
        image = client.text_to_image(
            enhanced_prompt, 
            negative_prompt=negative_prompt, 
            width=width, 
            height=height
        )
        
        # Convert PIL Image to Byte Stream
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)
        
        return Response(img_io.getvalue(), mimetype='image/png')

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/pg')
def pg_home():
    return send_from_directory('.', 'pg.html')

@app.route('/ng')
def ng_home():
    return send_from_directory('.', 'ng.html')

@app.route('/generate-post', methods=['POST'])
def generate_post():
    try:
        data = request.json
        if data is None:
             return jsonify({"error": "Invalid JSON body or missing Content-Type header"}), 400
             
        prompt = data.get('prompt', '').strip()
        aspect_ratio = data.get('aspect_ratio', '1:1')

        if not prompt:
            return jsonify({"error": "Please provide a description for your post."}), 400

        # No strict keyword validation for posts - allow creative freedom

        # Map Aspect Ratio to SDXL Optimal Resolutions
        RATIO_TO_SIZE = {
            "1:1": (1024, 1024),
            "16:9": (1344, 768),
            "9:16": (768, 1344),
            "2:3": (832, 1216),
            "3:4": (896, 1152),
            "1:2": (640, 1536), 
            "2:1": (1536, 640), 
            "4:5": (896, 1120),
            "3:2": (1216, 832),
            "4:3": (1152, 896),
        }
        
        width, height = RATIO_TO_SIZE.get(aspect_ratio, (1024, 1024))

        # Enhance prompt for Social Media Posts/Posters
        enhanced_prompt = f"professional social media post design, {prompt}, high quality, trending aesthetics, engaging visual, clear composition"
        negative_prompt = "blurry, low quality, distorted, ugly, bad composition, watermark, ui, interface, buttons, text overlay, mockup, frame"

        # Generate image using the client with dimensions
        image = client.text_to_image(
            enhanced_prompt, 
            negative_prompt=negative_prompt, 
            width=width, 
            height=height
        )
        
        # Convert PIL Image to Byte Stream
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)
        
        return Response(img_io.getvalue(), mimetype='image/png')

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/generate-names', methods=['POST'])
def generate_names():
    try:
        data = request.json
        mode = data.get('mode', 'name')
        prompt = data.get('prompt', '').strip()
        
        if not prompt:
            return jsonify({"error": "Please provide a description."}), 400
        
        prompts = {
            "name": "You are an expert creative writer specializing ONLY in catchy names, titles, taglines, and slogans. STRICT RULE: You MUST REFUSE any request that is not about generating names, titles, slogans, or taglines. If the request is out of scope (e.g., writing emails, summarizing text, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
            "general": "You are Mogli, a helpful AI assistant for general conversation. STRICT RULE: You MUST REFUSE specialized tasks like writing professional emails, generating business names, summarizing long texts, or writing product copy. If the user asks for these, politely refuse and say: 'Please change the mode for better results and accuracy.'",
            "summarize": "You are an expert at summarizing text. STRICT RULE: You MUST REFUSE any request that is not about summarizing provided text. If the request is out of scope (e.g., generating names, writing emails, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
            "email": "You are a professional email writer. STRICT RULE: You MUST REFUSE any request that is not about drafting or improving emails. OUTPUT RULE: Generate ONE single, polished email. Do not provide multiple options. ALWAYS start the email content with a 'Subject:' line. If you have conversational text (e.g., 'Here is a draft'), place it BEFORE the 'Subject:' line. If the request is out of scope (e.g., generating names, summarizing, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
            "product": "You are a creative product writer. STRICT RULE: You MUST REFUSE any request that is not about product descriptions, features, or marketing copy. If the request is out of scope (e.g., generating names, writing emails, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'"
        }
        
        system_prompt = prompts.get(mode, prompts["name"])
        
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )
        
        if not response.ok:
            return jsonify({"error": f"Groq API Error: {response.text}"}), response.status_code
            
        return jsonify(response.json())

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@app.route('/enhance-prompt', methods=['POST'])
def enhance_prompt():
    try:
        data = request.json
        prompt = data.get('prompt', '').strip()
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        system_prompt = "You are an expert prompt engineer for Stable Diffusion and Midjourney. Rewrite the user's prompt to be highly detailed, artistic, and descriptive, focusing on lighting, texture, composition, and style. Output ONLY the enhanced prompt. Do not add any conversational text."

        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )

        if not response.ok:
            return jsonify({"error": f"Groq API Error: {response.text}"}), response.status_code

        data = response.json()
        enhanced_text = data['choices'][0]['message']['content']
        return jsonify({"enhanced_prompt": enhanced_text})

    except Exception as e:
        print(f"Error enhancing prompt: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("--- REGISTERED ROUTES ---")
    for rule in app.url_map.iter_rules():
        print(f"Route: {rule}")
    print("-------------------------")
    app.run(debug=True, port=5000)
