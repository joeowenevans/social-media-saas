import { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const handler: Handler = async (event) => {
  console.log('=== CAPTION GENERATION API CALLED ===')
  console.log('HTTP Method:', event.httpMethod)
  console.log('Timestamp:', new Date().toISOString())

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
    console.log('Parsing request body...')
    const requestBody = JSON.parse(event.body || '{}')
    console.log('Request body keys:', Object.keys(requestBody))

    const {
      mediaUrl,
      mediaType,
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
    } = requestBody

    console.log('Media URL:', mediaUrl)
    console.log('Media Type:', mediaType)
    console.log('Brand Name:', brandName)

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: OpenAI API key not found in environment variables!')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      }
    }
    console.log('OpenAI API key found:', process.env.OPENAI_API_KEY ? 'Yes (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'No')

    if (!mediaUrl) {
      console.error('ERROR: mediaUrl is required but not provided')
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'mediaUrl is required' }),
      }
    }

    // Convert video URL to thumbnail URL for OpenAI vision API
    let imageUrlForAI = mediaUrl

    if (mediaType === 'video') {
      console.log('Processing video - converting to thumbnail...')
      console.log('Original video URL:', mediaUrl)

      // Cloudinary video thumbnail transformation
      // Extracts first frame (so_0) and resizes to 400x400
      imageUrlForAI = mediaUrl
        .replace('/video/upload/', '/video/upload/so_0,w_400,h_400,c_fill/')
        .replace(/\.(mp4|mov|avi)$/i, '.jpg')

      console.log('Thumbnail URL generated:', imageUrlForAI)
    } else {
      console.log('Processing image - using original URL')
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

FIRST, analyze this specific image carefully:
- What is the main subject?
- What style, setting, or context do you see?
- What colors, mood, or emotions does it convey?
- What unique details stand out?

Use these specific observations in your caption. Reference what makes THIS particular image special - don't write generic captions.

${brandContext}
${lengthGuidance}
Number of hashtags: ${hashtags}${hashtagContext}
Call-to-action style: ${ctaText}
Number of emojis to use: ${emojis}${examplesContext}${phrasesContext}

CAPTION OPENING - IMPORTANT:
Vary your opening style. Don't always use the same pattern. Mix it up using different approaches:
- Bold statement
- Descriptive scene-setting ("Meet..." / "Introducing..." / "This...")
- Emotion or reaction ("We're obsessed with..." / "Can't stop looking at...")
- Direct reference to the subject
- Story-like opening
- Occasional question (but not every time)

Each caption should feel fresh and unique - avoid repetitive patterns.

Format the caption as follows:
1. Start with a varied, engaging opening that describes THIS specific image (${lengthGuidance})
2. Reference specific visual elements you observe
3. Add a line break
4. Include ${hashtags} relevant hashtags
5. End with a call-to-action using the style: "${ctaText}"

Make it authentic, engaging, and optimized for social media engagement. Use ${emojis} emojis naturally throughout the caption. Match the brand voice and values described above.

IMPORTANT:
- Your caption must clearly relate to what's shown in this specific image
- Avoid generic phrases that could apply to any image
- Each caption should have a different opening style than the last`

    console.log('Prompt length:', prompt.length)
    console.log('Image URL being sent to OpenAI:', imageUrlForAI)
    console.log('Calling OpenAI API with model: gpt-4o-mini')

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
                url: imageUrlForAI,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    console.log('OpenAI API response received successfully')
    console.log('Response choices length:', response.choices?.length)

    const caption = response.choices[0]?.message?.content || ''

    console.log('Generated caption length:', caption.length)
    console.log('Caption preview:', caption.substring(0, 100) + '...')
    console.log('=== CAPTION GENERATION SUCCESSFUL ===')

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ caption }),
    }
  } catch (error: any) {
    console.error('=== CAPTION GENERATION API ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error object:', JSON.stringify(error, null, 2))

    if (error.response) {
      console.error('OpenAI API response error details:')
      console.error('  Status:', error.response.status)
      console.error('  Status Text:', error.response.statusText)
      console.error('  Headers:', error.response.headers)
      console.error('  Data:', JSON.stringify(error.response.data, null, 2))
    }

    if (error.cause) {
      console.error('Error cause:', error.cause)
    }

    // Log additional context
    console.error('Environment check:')
    console.error('  Node version:', process.version)
    console.error('  OpenAI key exists:', !!process.env.OPENAI_API_KEY)
    console.error('  OpenAI key length:', process.env.OPENAI_API_KEY?.length || 0)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to generate caption',
        details: error.message,
        errorName: error.name,
        timestamp: new Date().toISOString(),
      }),
    }
  }
}
