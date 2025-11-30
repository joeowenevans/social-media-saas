import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2, ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  const inputStyle = {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '16px',
    color: '#e5e5e5',
    fontSize: '15px',
    lineHeight: '1.6',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box' as const
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
          .contact-header-inner { padding: 0 16px !important; }
          .contact-content { padding: 32px 16px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
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
          className="contact-header-inner"
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
          className="contact-content"
          style={{
            maxWidth: '1000px',
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
              Contact Us
            </h1>
            <p style={{ color: '#888', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Have a question or need assistance? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px'
            }}
          >
            {/* Contact Info */}
            <div>
              <h2 style={{ color: '#e5e5e5', fontSize: '22px', fontWeight: 600, marginBottom: '24px' }}>
                Get in Touch
              </h2>

              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '24px'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      background: 'rgba(20, 184, 166, 0.1)',
                      border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}
                  >
                    <Mail style={{ width: '22px', height: '22px', color: '#14b8a6' }} />
                  </div>
                  <div>
                    <p style={{ color: '#e5e5e5', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                      Email
                    </p>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                      hello@socialai.com
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      background: 'rgba(20, 184, 166, 0.1)',
                      border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}
                  >
                    <MessageSquare style={{ width: '22px', height: '22px', color: '#14b8a6' }} />
                  </div>
                  <div>
                    <p style={{ color: '#e5e5e5', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                      Response Time
                    </p>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  padding: '24px'
                }}
              >
                <h3 style={{ color: '#14b8a6', fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                  Office Hours
                </h3>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.8 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM (GMT)<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  placeholder="How can we help?"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  placeholder="Tell us more about your enquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: sending ? '#2a2a2a' : '#14b8a6',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!sending) {
                    e.currentTarget.style.background = '#0d9488'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sending) {
                    e.currentTarget.style.background = '#14b8a6'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '18px', height: '18px' }} />
                    Send Message
                  </>
                )}
              </button>
            </form>
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
