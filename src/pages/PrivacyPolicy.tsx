import { Link } from 'react-router-dom'
import { Share2, ArrowLeft } from 'lucide-react'

export function PrivacyPolicy() {
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
            to="/dashboard"
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
            to="/dashboard"
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
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '64px 24px'
          }}
        >
          <h1
            style={{
              color: '#14b8a6',
              fontSize: '36px',
              fontWeight: 700,
              marginBottom: '16px',
              textShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.4)'
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '48px' }}>
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div style={{ color: '#e5e5e5', fontSize: '16px', lineHeight: 1.8 }}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                1. Introduction
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Welcome to SocialAI. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                2. Information We Collect
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We collect information that you provide directly to us, including:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Account information (email address, password)</li>
                <li style={{ marginBottom: '8px' }}>Brand profile information (brand name, industry, voice preferences)</li>
                <li style={{ marginBottom: '8px' }}>Content you upload (images, videos)</li>
                <li style={{ marginBottom: '8px' }}>Scheduled post information and captions</li>
                <li style={{ marginBottom: '8px' }}>Usage data and analytics</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                3. How We Use Your Information
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We use the information we collect to:
              </p>
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Provide, maintain, and improve our services</li>
                <li style={{ marginBottom: '8px' }}>Generate AI-powered captions tailored to your brand</li>
                <li style={{ marginBottom: '8px' }}>Schedule and publish your social media content</li>
                <li style={{ marginBottom: '8px' }}>Send you technical notices and support messages</li>
                <li style={{ marginBottom: '8px' }}>Respond to your comments and questions</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organisational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                5. Your Rights
              </h2>
              <p style={{ marginBottom: '16px' }}>
                You have the right to:
              </p>
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Access your personal data</li>
                <li style={{ marginBottom: '8px' }}>Correct inaccurate data</li>
                <li style={{ marginBottom: '8px' }}>Request deletion of your data</li>
                <li style={{ marginBottom: '8px' }}>Export your data</li>
                <li style={{ marginBottom: '8px' }}>Withdraw consent at any time</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                6. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <Link to="/contact" style={{ color: '#14b8a6', textDecoration: 'none' }}>
                  our contact page
                </Link>.
              </p>
            </section>
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
