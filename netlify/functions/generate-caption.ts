import { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const {
      mediaUrl,
      // New comprehensive brand fields
      brandName,
      industryNiche,
      voiceDescription,
      audiencePriorities,
      brandValues,
      preferredCaptionLength,
      hashtagTopics,
      ctaStyle,
      exampleCaptions,
      phrasesTaglines,
      generalGoals,
      numHashtags,
      numEmojis,
      // Legacy fields (for backwards compatibility)
      brandVoice,
      targetAudience,
      hashtagCount,
      hashtagsAlwaysUse,
      hashtagsAvoid,
      ctaPreference,
      emojiCount,
    } = JSON.parse(event.body || '{}')

    if (!mediaUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'mediaUrl is required' }),
      }
    }

    // Use new fields if available, fallback to legacy fields
    const voice = voiceDescription || brandVoice || 'professional and engaging'
    const audience = audiencePriorities || targetAudience || 'general audience'
    const hashtags = numHashtags !== undefined ? numHashtags : (hashtagCount || 7)
    const emojis = numEmojis !== undefined ? numEmojis : (emojiCount || 2)
    const captionLength = preferredCaptionLength || 'medium'

    // Build comprehensive brand context
    let brandContext = ''
    if (brandName) brandContext += `Brand: ${brandName}\n`
    if (industryNiche) brandContext += `Industry: ${industryNiche}\n`
    if (voice) brandContext += `Voice: ${voice}\n`
    if (audience) brandContext += `Audience: ${audience}\n`
    if (brandValues) brandContext += `Values: ${brandValues}\n`
    if (generalGoals) brandContext += `Goals: ${generalGoals}\n`

    // Build CTA text based on style
    let ctaText = ''
    const style = ctaStyle || ctaPreference || 'direct'

    switch (style) {
      case 'direct':
        ctaText = 'Shop now / Book today / Get yours'
        break
      case 'soft':
        ctaText = 'Learn more / Discover / Explore'
        break
      case 'question':
        ctaText = 'Ready to transform your space? / Interested?'
        break
      case 'none':
        ctaText = 'No call-to-action needed'
        break
      // Legacy values
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

    // Caption length guidance
    let lengthGuidance = ''
    switch (captionLength) {
      case 'short':
        lengthGuidance = 'Keep it brief - 1-2 sentences maximum.'
        break
      case 'medium':
        lengthGuidance = 'Use 3-5 sentences for moderate detail.'
        break
      case 'long':
        lengthGuidance = 'Write 6 or more sentences with rich detail and storytelling.'
        break
      default:
        lengthGuidance = 'Use 3-5 sentences.'
    }

    // Add example captions context
    let examplesContext = ''
    if (exampleCaptions && exampleCaptions.trim()) {
      examplesContext = `\n\nEXAMPLE CAPTIONS TO LEARN FROM:\n${exampleCaptions}\n\nMatch the style, tone, and structure of these examples.`
    }

    // Add signature phrases
    let phrasesContext = ''
    if (phrasesTaglines && phrasesTaglines.trim()) {
      phrasesContext = `\n\nOCCASIONALLY include these signature phrases naturally: ${phrasesTaglines}`
    }

    // Add hashtag topics
    let hashtagContext = ''
    if (hashtagTopics && hashtagTopics.trim()) {
      hashtagContext = `\nUse these topics/keywords for hashtags: ${hashtagTopics}`
    } else if (hashtagsAlwaysUse && Array.isArray(hashtagsAlwaysUse) && hashtagsAlwaysUse.length > 0) {
      hashtagContext = `\nALWAYS include these hashtags: ${hashtagsAlwaysUse.join(' ')}`
    }

    // Add hashtags to avoid
    if (hashtagsAvoid && Array.isArray(hashtagsAvoid) && hashtagsAvoid.length > 0) {
      hashtagContext += `\nNEVER use these hashtags: ${hashtagsAvoid.join(', ')}`
    }

    const prompt = `You are a social media caption expert. Create an engaging Instagram caption for this image/video.

${brandContext}
${lengthGuidance}
Number of hashtags: ${hashtags}${hashtagContext}
Call-to-action style: ${ctaText}
Number of emojis to use: ${emojis}${examplesContext}${phrasesContext}

Format the caption as follows:
1. Start with engaging sentences that describe the content and connect with the audience (${lengthGuidance})
2. Add a line break
3. Include ${hashtags} relevant hashtags
4. End with a call-to-action using the style: "${ctaText}"

Make it authentic, engaging, and optimized for social media engagement. Use ${emojis} emojis naturally throughout the caption. Match the brand voice and values described above.`

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
      max_tokens: 500,
      temperature: 0.7,
    })

    const caption = response.choices[0]?.message?.content || ''

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ caption }),
    }
  } catch (error: any) {
    console.error('Caption generation error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to generate caption',
        details: error.message,
      }),
    }
  }
}
