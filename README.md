<div align="center">
  <img src="frontend/src/assets/Mogli%20logo%20name.png" alt="Mogli Logo" width="150" />
  <h1>Mogli: AI Creative Suite</h1>
  <p>A highly advanced, monochrome AI assistant and creative workspace built on the MEAN Stack.</p>
</div>

<br/>

## Overview
Mogli is an AI-powered creative suite that provides powerful generative tools for creators, featuring a clean, minimalist monochrome design.

---

## Features
- **Strict Monochrome UI:** The entire interface is built using pure black, deep greys, and stark white, creating a highly premium, distraction-free environment.
- **Advanced Animations:** The login and authentication flow features a floating 3D grid floor, deep blurred ambient glows, and inputs that trace themselves with light.
- **AI Text Assistant (Groq):** Blazing-fast conversational AI powered by Llama 3.1 8B via the Groq API.
- **AI Image Generation (HuggingFace):** Native integration with Stable Diffusion 3 to instantly generate logos, assets, and images.
- **Creator Tools:** Dedicated interfaces for Logo Generation, Name Generation, Email Writing, Text Summarization, and Social Media Post Generation.
- **Markdown Rendering:** Beautiful, natively rendered markdown for all AI responses—no raw asterisks or unformatted lists.

### Upcoming Features
- **MongoDB Persistence:** Storing conversation histories, user accounts, and image generation libraries in a persistent MongoDB database.
- **Workspace Collaboration:** Share your spaces with other creators.
- **Advanced Toolset Expansion:** More specialized AI pipelines for marketing workflows.

---

## Tech Stack
This application has been fully migrated to a robust, modern architecture:
- **Frontend:** Angular 19 (TypeScript, RxJS)
- **Backend:** Node.js, Express.js (JavaScript)
- **Authentication:** JWT (JSON Web Tokens) with in-memory persistence (Ready for MongoDB integration).
- **APIs:** Groq API (Text), HuggingFace Inference API (Images)
- **Styling:** Pure Vanilla CSS (No Tailwind) using modern features like `backdrop-filter`, `mask-image`, and CSS variables.

---

## Installation & Usage

Because Mogli is a decoupled MEAN stack application, you need to run the backend and frontend simultaneously.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v22+)
- npm (Node Package Manager)

### 2. Environment Variables
To keep your API keys secure, they must not be committed. Create a file named `.env` inside the `backend/` directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:4200

# Groq API (Text Generation)
GROQ_API_KEY=your_groq_key_here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.1-8b-instant

# HuggingFace API (Image Generation)
HF_API_KEY=your_hf_key_here
HF_MODEL_ID=stabilityai/stable-diffusion-3-medium-diffusers
HF_API_URL=https://api-inference.huggingface.co/models

# Authentication
JWT_SECRET=your_jwt_secret_here
```

### 3. Start the Backend API
Open your terminal and run:
```bash
cd backend
npm install
npm start
```
*The Express API will spin up on `http://localhost:3000`.*

### 4. Start the Frontend
Open a second terminal window and run:
```bash
cd frontend
npm install
npm start
```
*The Angular Dev Server will spin up on `http://localhost:4200`.*

Open `http://localhost:4200` in your browser. The frontend is configured with a proxy (`proxy.conf.json`) that automatically routes `/api` calls to the local Express backend, bypassing CORS issues cleanly.

---

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate an existing user and receive a JWT. |
| `POST` | `/api/auth/signup` | Register a new user and receive a JWT. |
| `POST` | `/api/chat` | Send messages to the Groq LLM API. |
| `POST` | `/api/enhance` | Enhance a user's prompt using Groq before sending to Image Generation. |
| `POST` | `/api/generate` | Generate an image via HuggingFace's Stable Diffusion model. |

---

<div align="center">
  <p><i>"Configure your neural creative suite."</i></p>
</div>
