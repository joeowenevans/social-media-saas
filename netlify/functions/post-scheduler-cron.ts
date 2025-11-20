import { Handler, schedule } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// This function runs every 5 minutes
export const handler: Handler = schedule('*/5 * * * *', async () => {
  try {
    console.log('Running post scheduler cron...')

    // Get posts scheduled for the next 5 minutes
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000)

    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        media (*),
        brands!inner (
          id,
          user_id
        )
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_for', now.toISOString())
      .lte('scheduled_for', fiveMinutesFromNow.toISOString())

    if (error) {
      console.error('Error fetching scheduled posts:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch scheduled posts' }),
      }
    }

    console.log(`Found ${posts?.length || 0} posts to process`)

    if (!posts || posts.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No posts to process' }),
      }
    }

    // Process each post
    const results = await Promise.allSettled(
      posts.map(async (post) => {
        try {
          // Get social accounts for this brand
          const { data: socialAccounts, error: socialError } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('brand_id', post.brands.id)
            .eq('is_active', true)
            .in('platform', post.platforms || [])

          if (socialError) throw socialError

          if (!socialAccounts || socialAccounts.length === 0) {
            throw new Error('No active social accounts found for selected platforms')
          }

          // Prepare tokens for n8n
          const tokens: Record<string, string> = {}
          socialAccounts.forEach((account) => {
            if (account.access_token) {
              tokens[account.platform] = account.access_token
            }
          })

          // Call n8n webhook
          const n8nResponse = await fetch(`${process.env.N8N_URL}/webhook/post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.N8N_API_KEY}`,
            },
            body: JSON.stringify({
              caption: post.final_caption,
              mediaUrl: post.media.cloudinary_url,
              platforms: post.platforms,
              tokens,
            }),
          })

          if (!n8nResponse.ok) {
            throw new Error(`N8N webhook failed: ${n8nResponse.statusText}`)
          }

          // Update post status to posted
          await supabase
            .from('posts')
            .update({
              status: 'posted',
              posted_at: new Date().toISOString(),
            })
            .eq('id', post.id)

          console.log(`Successfully posted: ${post.id}`)
          return { success: true, postId: post.id }
        } catch (postError: any) {
          console.error(`Failed to post ${post.id}:`, postError)

          // Update post status to failed
          await supabase
            .from('posts')
            .update({
              status: 'failed',
              error_message: postError.message,
            })
            .eq('id', post.id)

          return { success: false, postId: post.id, error: postError.message }
        }
      })
    )

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length
    const failed = results.length - successful

    console.log(`Processed ${results.length} posts: ${successful} successful, ${failed} failed`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        processed: results.length,
        successful,
        failed,
      }),
    }
  } catch (error: any) {
    console.error('Cron job error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Cron job failed',
        details: error.message,
      }),
    }
  }
})
