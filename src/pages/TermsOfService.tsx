import { Link } from 'react-router-dom'
import { Share2, ArrowLeft } from 'lucide-react'

export function TermsOfService() {
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
            Terms of Service
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '48px' }}>
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div style={{ color: '#e5e5e5', fontSize: '16px', lineHeight: 1.8 }}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                1. Agreement to Terms
              </h2>
              <p style={{ marginBottom: '16px' }}>
                By accessing or using SocialAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                2. Use Licence
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Permission is granted to temporarily use SocialAI for personal or commercial social media management purposes. This licence does not include:
              </p>
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Modifying or copying the service's materials</li>
                <li style={{ marginBottom: '8px' }}>Using the service for any unlawful purpose</li>
                <li style={{ marginBottom: '8px' }}>Attempting to reverse engineer any software</li>
                <li style={{ marginBottom: '8px' }}>Removing any copyright or proprietary notations</li>
                <li style={{ marginBottom: '8px' }}>Transferring the service to another person</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                3. Account Responsibilities
              </h2>
              <p style={{ marginBottom: '16px' }}>
                You are responsible for:
              </p>
              <ul style={{ paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Maintaining the confidentiality of your account credentials</li>
                <li style={{ marginBottom: '8px' }}>All activities that occur under your account</li>
                <li style={{ marginBottom: '8px' }}>Ensuring your content does not violate any laws or third-party rights</li>
                <li style={{ marginBottom: '8px' }}>Notifying us immediately of any unauthorised use</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                4. Content Ownership
              </h2>
              <p style={{ marginBottom: '16px' }}>
                You retain ownership of all content you upload to SocialAI. By using our service, you grant us a licence to use, store, and process your content solely for the purpose of providing our services.
              </p>
              <p>
                AI-generated captions created by our service are provided for your use and become your property once generated.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                5. Service Availability
              </h2>
              <p>
                We strive to maintain high availability of our service. However, we do not guarantee uninterrupted access and may temporarily suspend the service for maintenance, updates, or other reasons without prior notice.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                6. Limitation of Liability
              </h2>
              <p>
                SocialAI and its suppliers shall not be liable for any damages arising from the use or inability to use the service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                7. Modifications
              </h2>
              <p>
                We may revise these Terms of Service at any time without notice. By using this service, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
                8. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us via{' '}
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
