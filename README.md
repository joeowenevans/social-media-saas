# SocialAI - AI-Powered Social Media Automation SaaS

A complete SaaS application for AI-powered social media automation built with React, TypeScript, Supabase, and OpenAI.

## Features

- **User Authentication** - Sign up, login, email verification, password reset via Supabase Auth
- **Brand Profile Management** - Create and customize brand voice, target audience, hashtag preferences
- **Media Upload** - Drag & drop interface with Cloudinary integration for images and videos
- **AI Caption Generation** - GPT-4o-mini Vision API generates engaging captions based on brand voice
- **Post Scheduling** - Schedule posts across Instagram, Facebook, and Pinterest
- **Auto-Posting** - Automated posting via n8n webhooks with cron jobs
- **Dashboard** - Overview of posts, stats, and quick actions
- **Subscription Management** - Stripe integration with free trial and paid plans

## Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **Date-fns** for date formatting

### Backend & Services
- **Netlify Functions** (Serverless)
- **Supabase** (PostgreSQL database + Authentication)
- **Cloudinary** (Media storage)
- **OpenAI GPT-4o-mini** (AI caption generation with vision)
- **n8n** (Workflow automation for social posting)
- **Stripe** (Payment processing)

## Project Structure

```
/
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   ├── brand/       # Brand profile components
│   │   ├── upload/      # Media upload components
│   │   ├── scheduling/  # Post scheduling components
│   │   ├── dashboard/   # Dashboard components
│   │   └── subscription/# Stripe subscription components
│   ├── lib/             # Library configurations
│   │   ├── supabase.ts  # Supabase client
│   │   ├── cloudinary.ts# Cloudinary upload
│   │   └── stripe.ts    # Stripe configuration
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── netlify/
│   └── functions/       # Serverless functions
│       ├── generate-caption.ts      # AI caption generation
│       └── post-scheduler-cron.ts   # Scheduled posting cron
├── supabase-schema.sql  # Database schema
├── netlify.toml         # Netlify configuration
└── .env.example         # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudinary account
- OpenAI API key
- n8n instance (for social posting)
- Stripe account (for payments)
- Netlify account (for hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your credentials:
   ```env
   # Supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_service_key

   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   STRIPE_PRICE_ID=your_price_id

   # n8n
   N8N_URL=your_n8n_instance_url
   N8N_API_KEY=your_n8n_api_key
   ```

4. **Set up Supabase database**

   a. Create a new Supabase project at https://supabase.com

   b. Go to SQL Editor and run the schema from `supabase-schema.sql`

   c. Enable Row Level Security (RLS) is automatically set up by the schema

5. **Set up Cloudinary**

   a. Create account at https://cloudinary.com

   b. Create an unsigned upload preset:
      - Go to Settings → Upload
      - Scroll to "Upload presets"
      - Click "Add upload preset"
      - Set "Signing Mode" to "Unsigned"
      - Copy the preset name to your .env file

6. **Set up OpenAI**

   a. Get API key from https://platform.openai.com/api-keys

   b. Add to .env file

7. **Set up n8n (Optional - for actual posting)**

   a. Deploy n8n instance (self-hosted or n8n.cloud)

   b. Create webhook workflow for posting to social media

   c. Add webhook URL to .env

8. **Set up Stripe (Optional - for payments)**

   a. Create account at https://stripe.com

   b. Get API keys from Dashboard

   c. Create a product and price

   d. Add webhook endpoint for subscription events

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

To test Netlify Functions locally, install Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Deployment

#### Deploy to Netlify

1. **Connect your repository**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add all variables from your .env file

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live in minutes!

## Usage

### 1. Sign Up and Create Brand Profile

- Create an account with email and password
- Set up your brand profile with:
  - Brand name
  - Brand voice description
  - Target audience
  - Hashtag preferences
  - Call-to-action style
  - Emoji count

### 2. Upload Content

- Navigate to "Upload" page
- Drag & drop an image or video
- AI automatically generates a caption based on your brand settings
- Edit the caption as needed

### 3. Schedule Posts

- Click "Schedule Post" after caption generation
- Select target platforms (Instagram, Facebook, Pinterest)
- Choose date and time
- Confirm scheduling

### 4. Manage Posts

- View all scheduled and posted content in Dashboard
- Edit or delete scheduled posts from Schedule page
- Monitor post status and errors

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `brands` - Brand profiles with voice and preferences
- `social_accounts` - Connected social media accounts
- `media` - Uploaded images and videos from Cloudinary
- `posts` - Scheduled and posted content
- `post_results` - Results per platform
- `subscriptions` - User subscription status

See `supabase-schema.sql` for complete schema with Row Level Security policies.

## API Endpoints (Netlify Functions)

### POST `/.netlify/functions/generate-caption`

Generates AI caption using OpenAI GPT-4o-mini Vision API.

**Request:**
```json
{
  "mediaUrl": "https://cloudinary.com/...",
  "brandVoice": "Professional and engaging",
  "targetAudience": "Young professionals",
  "hashtagCount": 7,
  "hashtagsAlwaysUse": ["#brand"],
  "hashtagsAvoid": ["#spam"],
  "ctaPreference": "visit_link",
  "emojiCount": 2
}
```

**Response:**
```json
{
  "caption": "Generated caption text..."
}
```

### Scheduled: `post-scheduler-cron`

Runs every 5 minutes to check for scheduled posts and publish them via n8n webhook.

## Security

- Environment variables for all secrets
- Row Level Security (RLS) enabled on all Supabase tables
- User authentication required for all protected routes
- Social account tokens encrypted in database
- HTTPS only in production
- CORS properly configured for API endpoints

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Email: support@socialai.com (update with your email)

## Roadmap

- [ ] Instagram OAuth integration
- [ ] Facebook OAuth integration
- [ ] Pinterest OAuth integration
- [ ] Stripe subscription management UI
- [ ] Analytics dashboard
- [ ] Post performance tracking
- [ ] Bulk upload and scheduling
- [ ] Team collaboration features
- [ ] Custom branded templates
- [ ] Video editing tools

## Acknowledgments

- OpenAI for GPT-4o-mini Vision API
- Supabase for backend infrastructure
- Cloudinary for media management
- Netlify for hosting and serverless functions
- The open source community

---

Built with ❤️ using React, TypeScript, and modern web technologies
