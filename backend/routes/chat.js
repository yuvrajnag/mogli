const express = require('express');
const axios = require('axios');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mode-specific system prompts — exact match with original Flask logic
const SYSTEM_PROMPTS = {
  name: "You are an expert creative writer specializing ONLY in catchy names, titles, taglines, and slogans. STRICT RULE: You MUST REFUSE any request that is not about generating names, titles, slogans, or taglines. If the request is out of scope (e.g., writing emails, summarizing text, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
  general: "You are Mogli, a helpful AI assistant for general conversation. STRICT RULE: You MUST REFUSE specialized tasks like writing professional emails, generating business names, summarizing long texts, or writing product copy. If the user asks for these, politely refuse and say: 'Please change the mode for better results and accuracy.'",
  summarize: "You are an expert at summarizing text. STRICT RULE: You MUST REFUSE any request that is not about summarizing provided text. If the request is out of scope (e.g., generating names, writing emails, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
  email: "You are a professional email writer. STRICT RULE: You MUST REFUSE any request that is not about drafting or improving emails. OUTPUT RULE: Generate ONE single, polished email. Do not provide multiple options. ALWAYS start the email content with a 'Subject:' line. If you have conversational text (e.g., 'Here is a draft'), place it BEFORE the 'Subject:' line. If the request is out of scope (e.g., generating names, summarizing, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
  product: "You are a creative product writer. STRICT RULE: You MUST REFUSE any request that is not about product descriptions, features, or marketing copy. If the request is out of scope (e.g., generating names, writing emails, chatting), politely refuse and say: 'Please change the mode for better results and accuracy.'",
};

/**
 * POST /api/generate-names
 * Sends a chat completion request to Groq API with the appropriate mode prompt.
 */
router.post(
  '/generate-names',
  asyncHandler(async (req, res) => {
    const { prompt, mode = 'name' } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a description.' });
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.name;

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

    res.json(response.data);
  })
);

module.exports = router;
