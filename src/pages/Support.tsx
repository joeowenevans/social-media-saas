import { Link } from 'react-router-dom'
import { Share2, ArrowLeft, HelpCircle, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How does AI caption generation work?',
    answer: 'Our AI analyses your uploaded images and videos using advanced vision technology. It understands the content, context, and your brand voice settings to generate engaging captions tailored specifically to your brand.'
  },
  {
    question: 'Which social media platforms are supported?',
    answer: 'SocialAI currently supports scheduling for Instagram, Facebook, and Pinterest. We\'re constantly working on adding more platforms to help you reach your audience wherever they are.'
  },
  {
    question: 'Can I edit the AI-generated captions?',
    answer: 'Absolutely! All AI-generated captions are fully editable. You can modify, add, or remove any text before scheduling your post. The AI provides a starting point, but you have complete control over the final content.'
  },
  {
    question: 'How do I set up my brand voice?',
    answer: 'Navigate to Settings and complete your Brand Profile. You can specify your industry, tone of voice, audience priorities, preferred caption length, and even provide example captions. The AI uses this information to match your unique style.'
  },
  {
    question: 'Is there a limit to how many posts I can schedule?',
    answer: 'With the Pro Plan, you get unlimited posts. Free trial users can schedule up to 10 posts to test the service before upgrading.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from the Settings page. Your account will remain active until the end of your current billing period.'
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support all common image formats including JPG, PNG, GIF, and WebP. For videos, we support MP4, MOV, and other standard formats.'
  },
  {
    question: 'How do I delete my account?',
    answer: 'You can delete your account from the Settings page under the "Danger Zone" section. Please note that this action is permanent and all your data will be deleted.'
  }
]

export function Support() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle, rgba(75, 85, 99, 0.35) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflowX: 'hidden',
        maxWidth: '100vw'
      }}
    >
      {/* Mobile styles */}
      <style>{`
        @media (max-width: 639px) {
          .support-header-inner { padding: 0 16px !important; }
          .support-content { padding: 32px 16px !important; }
          .support-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          background: '#0f0f0f',
          borderBottom: '1px solid #1a1a1a',
          height: '64px',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          className="support-header-inner"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: '0 48px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none'
            }}
          >
            <Share2 style={{ color: 'white', width: '24px', height: '24px' }} />
            <span style={{ color: '#14b8a6', fontSize: '20px', fontWeight: 700 }}>
              SocialAI
            </span>
          </Link>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#a1a1aa',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1 }}>
        <div
          className="support-content"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '64px 24px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1
              style={{
                color: '#14b8a6',
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '16px',
                textShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.4)'
              }}
            >
              Support Centre
            </h1>
            <p style={{ color: '#888', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Support Options */}
          <div
            className="support-cards"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              marginBottom: '64px'
            }}
          >
            <div
              style={{
                background: '#1a1a1a',
                border: '1px solid #27272a',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  margin: '0 auto 16px'
                }}
              >
                <HelpCircle style={{ width: '28px', height: '28px', color: '#14b8a6' }} />
              </div>
              <h3 style={{ color: '#e5e5e5', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                FAQs
              </h3>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Browse common questions below
              </p>
            </div>

            <Link
              to="/contact"
              style={{
                background: '#1a1a1a',
                border: '1px solid #27272a',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#27272a'}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  margin: '0 auto 16px'
                }}
              >
                <MessageCircle style={{ width: '28px', height: '28px', color: '#14b8a6' }} />
              </div>
              <h3 style={{ color: '#e5e5e5', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Contact Us
              </h3>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Get in touch with our team
              </p>
            </Link>

            <div
              style={{
                background: '#1a1a1a',
                border: '1px solid #27272a',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  margin: '0 auto 16px'
                }}
              >
                <Mail style={{ width: '28px', height: '28px', color: '#14b8a6' }} />
              </div>
              <h3 style={{ color: '#e5e5e5', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Email Support
              </h3>
              <p style={{ color: '#888', fontSize: '14px' }}>
                studio@dizzyotter.com
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 style={{ color: '#14b8a6', fontSize: '24px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ color: '#e5e5e5', fontSize: '16px', fontWeight: 500, paddingRight: '16px' }}>
                      {faq.question}
                    </span>
                    {openFAQ === index ? (
                      <ChevronUp style={{ width: '20px', height: '20px', color: '#14b8a6', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown style={{ width: '20px', height: '20px', color: '#888', flexShrink: 0 }} />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div
                      style={{
                        padding: '0 24px 20px',
                        color: '#888',
                        fontSize: '15px',
                        lineHeight: 1.7
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Still need help */}
          <div
            style={{
              marginTop: '64px',
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: '#e5e5e5', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
              Still need help?
            </h3>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>
              Our support team is here to assist you with any questions or issues.
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: '#14b8a6',
                color: 'white',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0d9488'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#14b8a6'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <MessageCircle style={{ width: '18px', height: '18px' }} />
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#0f0f0f',
          borderTop: '1px solid #1a1a1a',
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#888', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} SocialAI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
