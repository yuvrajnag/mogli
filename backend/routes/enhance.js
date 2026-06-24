const express = require('express');
const axios = require('axios');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * POST /api/enhance-prompt
 * Uses Groq API to rewrite a user prompt into a more detailed,
 * artistic prompt optimized for Stable Diffusion / Midjourney.
 */
router.post(
  '/enhance-prompt',
  asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt =
      'You are an expert prompt engineer for Stable Diffusion and Midjourney. Rewrite the user\'s prompt to be highly detailed, artistic, and descriptive, focusing on lighting, texture, composition, and style. Output ONLY the enhanced prompt. Do not add any conversational text.';

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_API_URL = process.env.GROQ_API_URL;
    const GROQ_MODEL = process.env.GROQ_MODEL;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const enhancedText = response.data.choices[0].message.content;
    res.json({ enhanced_prompt: enhancedText });
  })
);

module.exports = router;
