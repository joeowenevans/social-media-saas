import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      mediaUrl,
      brandVoice,
      targetAudience,
      hashtagCount,
      hashtagsAlwaysUse,
      hashtagsAvoid,
      ctaPreference,
      emojiCount,
    } = req.body

    if (!mediaUrl) {
      return res.status(400).json({ error: 'mediaUrl is required' })
    }

    // Build the prompt
    let ctaText = ''
    switch (ctaPreference) {
      case 'visit_link':
        ctaText = 'Link in bio'
        break
      case 'comment':
        ctaText = 'Drop a comment below'
        break
      case 'like_follow':
        ctaText = 'Like and follow for more'
        break
      case 'shop_now':
        ctaText = 'Shop now'
        break
      case 'learn_more':
        ctaText = 'Learn more'
        break
      default:
        ctaText = 'Check it out'
    }

    const alwaysUseHashtags = Array.isArray(hashtagsAlwaysUse) && hashtagsAlwaysUse.length > 0
      ? `\nALWAYS include these hashtags: ${hashtagsAlwaysUse.join(' ')}`
      : ''

    const avoidHashtags = Array.isArray(hashtagsAvoid) && hashtagsAvoid.length > 0
      ? `\nNEVER use these hashtags: ${hashtagsAvoid.join(', ')}`
      : ''

    const prompt = `You are a social media caption expert. Create an engaging Instagram caption for this image/video.

Brand Voice: ${brandVoice}
Target Audience: ${targetAudience}
Number of hashtags: ${hashtagCount || 7}${alwaysUseHashtags}${avoidHashtags}
Call-to-action: ${ctaText}
Number of emojis to use: ${emojiCount || 2}

Format the caption as follows:
1. Start with 2-3 engaging sentences that describe the content and connect with the audience
2. Add a line break
3. Include ${hashtagCount || 7} relevant hashtags
4. End with a call-to-action: "${ctaText}"

Make it authentic, engaging, and optimized for social media engagement. Use ${emojiCount || 2} emojis naturally throughout the caption.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: mediaUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const caption = response.choices[0]?.message?.content || ''

    return res.status(200).json({ caption })
  } catch (error: any) {
    console.error('Caption generation error:', error)
    return res.status(500).json({
      error: 'Failed to generate caption',
      details: error.message,
    })
  }
}
