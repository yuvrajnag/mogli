const express = require('express');
const axios = require('axios');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Aspect ratio to pixel size mapping (SDXL optimal resolutions)
const RATIO_TO_SIZE = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1344, height: 768 },
  '9:16': { width: 768, height: 1344 },
  '2:3': { width: 832, height: 1216 },
  '3:4': { width: 896, height: 1152 },
  '1:2': { width: 640, height: 1536 },
  '2:1': { width: 1536, height: 640 },
  '4:5': { width: 896, height: 1120 },
  '3:2': { width: 1216, height: 832 },
  '4:3': { width: 1152, height: 896 },
};

const LOGO_KEYWORDS = [
  'logo', 'icon', 'symbol', 'emblem', 'badge',
  'mark', 'brand', 'identity', 'logotype', 'monogram',
];

/**
 * POST /api/generate-logo
 * Generates a logo image using HuggingFace Inference API.
 */
router.post(
  '/generate-logo',
  asyncHandler(async (req, res) => {
    const { prompt, aspect_ratio = '1:1' } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a description for your logo.' });
    }

    // Validate logo keywords
    const lowerPrompt = prompt.toLowerCase();
    if (!LOGO_KEYWORDS.some((kw) => lowerPrompt.includes(kw))) {
      return res.status(400).json({
        error: "Please include 'logo', 'icon', or 'symbol' in your prompt to generate a logo.",
      });
    }

    const { width, height } = RATIO_TO_SIZE[aspect_ratio] || RATIO_TO_SIZE['1:1'];
    const enhancedPrompt = `professional vector logo design, ${prompt}, minimal, vector art, white background, centered, high quality`;
    const negativePrompt = 'blurry, low quality, text, watermark, realistic, photo, 3d render, complex background, ui, interface, buttons, frames, borders';

    const HF_API_URL = process.env.HF_API_URL;
    const HF_MODEL_ID = process.env.HF_MODEL_ID;
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      `${HF_API_URL}/${HF_MODEL_ID}`,
      {
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: negativePrompt,
          width,
          height,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(response.data));
  })
);

/**
 * POST /api/generate-post
 * Generates a social media post/poster image using HuggingFace Inference API.
 */
router.post(
  '/generate-post',
  asyncHandler(async (req, res) => {
    const { prompt, aspect_ratio = '1:1' } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a description for your post.' });
    }

    const { width, height } = RATIO_TO_SIZE[aspect_ratio] || RATIO_TO_SIZE['1:1'];
    const enhancedPrompt = `professional social media post design, ${prompt}, high quality, trending aesthetics, engaging visual, clear composition`;
    const negativePrompt = 'blurry, low quality, distorted, ugly, bad composition, watermark, ui, interface, buttons, text overlay, mockup, frame';

    const HF_API_URL = process.env.HF_API_URL;
    const HF_MODEL_ID = process.env.HF_MODEL_ID;
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      `${HF_API_URL}/${HF_MODEL_ID}`,
      {
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: negativePrompt,
          width,
          height,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(response.data));
  })
);

module.exports = router;
