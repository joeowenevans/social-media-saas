import { Link } from 'react-router-dom'
import { Share2, Calendar, Wand2, TrendingUp, CheckCircle2, Sparkles, Twitter, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react'

export function Landing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1A1F36',
        backgroundImage: 'radial-gradient(circle, rgba(80, 227, 194, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(80, 227, 194, 0.15), 0 0 30px rgba(80, 227, 194, 0.1); }
          50% { box-shadow: 0 0 20px rgba(80, 227, 194, 0.25), 0 0 40px rgba(80, 227, 194, 0.15); }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(80, 227, 194, 0.5), 0 0 40px rgba(80, 227, 194, 0.3); }
          50% { text-shadow: 0 0 25px rgba(80, 227, 194, 0.6), 0 0 50px rgba(80, 227, 194, 0.4); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .feature-card {
          animation: float 6s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .feature-card:nth-child(2) { animation-delay: 0.5s; }
        .feature-card:nth-child(3) { animation-delay: 1s; }
        .feature-card:nth-child(4) { animation-delay: 1.5s; }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(80, 227, 194, 0.2), 0 0 60px rgba(80, 227, 194, 0.1);
        }
        .hero-title {
          animation: text-glow 4s ease-in-out infinite;
        }
        .cta-button {
          animation: subtle-glow 3s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #50E3C2 0%, #2979FF 50%, #50E3C2 100%);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .hero-section { padding: 60px 20px 40px !important; }
          .hero-title { font-size: 2.25rem !important; line-height: 1.2 !important; }
          .hero-subtitle { font-size: 1rem !important; margin-bottom: 32px !important; }
          .features-section { padding: 40px 20px 60px !important; }
          .features-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .feature-card { padding: 24px !important; }
          .section-title { font-size: 1.75rem !important; }
          .section-subtitle { font-size: 1rem !important; }
          .cta-section { padding: 60px 20px !important; }
          .cta-card { padding: 32px 24px !important; }
          .cta-title { font-size: 1.5rem !important; }
          .cta-button { padding: 14px 28px !important; font-size: 16px !important; }
          .header-button { padding: 10px 20px !important; font-size: 14px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; text-align: center !important; }
          .footer-social { justify-content: center !important; }
          .footer-links { align-items: center !important; }
          .orb { opacity: 0.25 !important; }
          .header-inner { padding: 0 16px !important; }
        }
      `}</style>

      {/* Ambient Orbs */}
      <div className="orb" style={{ width: '500px', height: '500px', background: '#50E3C2', top: '-200px', left: '-100px' }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: '#2979FF', top: '40%', right: '-150px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: '#50E3C2', bottom: '10%', left: '20%' }} />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(26, 31, 54, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(80, 227, 194, 0.1)'
        }}
      >
        <div className="header-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #50E3C2 0%, #3dd4b0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(80, 227, 194, 0.4)'
                }}
              >
                <Share2 style={{ width: '20px', height: '20px', color: '#1A1F36' }} />
              </div>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#50E3C2' }}>SocialAI</span>
            </div>

            {/* Nav - Just Sign In */}
            <Link
              to="/login"
              className="header-button"
              style={{
                padding: '12px 28px',
                background: '#50E3C2',
                color: '#1A1F36',
                fontWeight: 600,
                fontSize: '15px',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 15px rgba(80, 227, 194, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2979FF'
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(41, 121, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#50E3C2'
                e.currentTarget.style.color = '#1A1F36'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(80, 227, 194, 0.2)'
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Main Title */}
          <h1
            className="hero-title"
            style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: '#F2F4F8',
              marginBottom: '24px',
              lineHeight: 1.1
            }}
          >
            Social Media Management
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: '1.35rem',
              color: 'rgba(242, 244, 248, 0.7)',
              maxWidth: '650px',
              margin: '0 auto 48px',
              lineHeight: 1.7
            }}
          >
            Create stunning captions, schedule posts across all platforms, and grow your audience. Your complete social media manager, in one place.
          </p>

          {/* Single CTA Button */}
          <Link
            to="/login"
            className="cta-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 40px',
              background: '#50E3C2',
              color: '#1A1F36',
              fontSize: '18px',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2979FF'
              e.currentTarget.style.color = '#FFFFFF'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#50E3C2'
              e.currentTarget.style.color = '#1A1F36'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Get Started
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '40px 24px 120px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              className="section-title"
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#F2F4F8',
                marginBottom: '16px',
                textShadow: '0 0 40px rgba(80, 227, 194, 0.3)'
              }}
            >
              Everything you need to <span style={{ color: '#50E3C2' }}>succeed</span>
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.2rem', color: 'rgba(242, 244, 248, 0.6)', maxWidth: '600px', margin: '0 auto' }}>
              Powerful features designed to streamline your social media workflow
            </p>
          </div>

          {/* Feature Cards */}
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}
          >
            {[
              { icon: Wand2, title: 'Smart Captions', desc: 'Generate engaging captions tailored to your brand voice and target audience.' },
              { icon: Calendar, title: 'Easy Scheduling', desc: 'Schedule posts across Instagram, Facebook, and Pinterest with our intuitive calendar.' },
              { icon: TrendingUp, title: 'Multi-Platform', desc: 'Post to all your social accounts simultaneously with one click.' },
              { icon: Sparkles, title: 'Brand Voice', desc: 'Customise your brand voice and preferences for consistent, on-brand content.' }
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: 'rgba(36, 42, 69, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(80, 227, 194, 0.15)',
                  borderRadius: '20px',
                  padding: '32px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(80, 227, 194, 0.2) 0%, rgba(41, 121, 255, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}
                >
                  <feature.icon style={{ width: '28px', height: '28px', color: '#50E3C2' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F2F4F8', marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(242, 244, 248, 0.6)', lineHeight: 1.6, fontSize: '15px' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Vague about pricing */}
      <section className="cta-section" style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            className="cta-card"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(36, 42, 69, 0.9) 0%, rgba(26, 31, 54, 0.9) 100%)',
              border: '1px solid rgba(80, 227, 194, 0.3)',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              boxShadow: '0 0 60px rgba(80, 227, 194, 0.15), 0 0 100px rgba(80, 227, 194, 0.08)'
            }}
          >
            <h2
              className="cta-title"
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#F2F4F8',
                marginBottom: '16px'
              }}
            >
              Ready to streamline your social media?
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(242, 244, 248, 0.6)', marginBottom: '32px', lineHeight: 1.7 }}>
              Take control of your social presence and start creating with ease.
            </p>

            {/* Features List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
              {[
                'Unlimited scheduling',
                'Smart captions',
                'Multi-platform support',
                'Brand customisation'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '18px', height: '18px', color: '#50E3C2', flexShrink: 0 }} />
                  <span style={{ color: '#F2F4F8', fontSize: '14px', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="cta-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 48px',
                background: '#50E3C2',
                color: '#1A1F36',
                fontSize: '18px',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2979FF'
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#50E3C2'
                e.currentTarget.style.color = '#1A1F36'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Get Started
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'rgba(21, 25, 41, 0.9)',
          borderTop: '1px solid rgba(80, 227, 194, 0.1)',
          padding: '64px 24px 32px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginBottom: '48px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: 'inherit' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #50E3C2 0%, #3dd4b0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Share2 style={{ width: '18px', height: '18px', color: '#1A1F36' }} />
                </div>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#50E3C2' }}>SocialAI</span>
              </div>
              <p style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '14px', lineHeight: 1.7 }}>
                Social media management made simple. Create, schedule, and optimise your content effortlessly.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ color: '#F2F4F8', fontWeight: 600, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quick Links
              </h4>
              <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms of Service' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/support', label: 'Support' }
                ].map((link, i) => (
                  <Link
                    key={i}
                    to={link.to}
                    style={{
                      color: 'rgba(242, 244, 248, 0.5)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.5)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 style={{ color: '#F2F4F8', fontWeight: 600, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Follow Us
              </h4>
              <div className="footer-social" style={{ display: 'flex', gap: '12px' }}>
                {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(36, 42, 69, 0.6)',
                      border: '1px solid rgba(80, 227, 194, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#50E3C2'
                      e.currentTarget.style.borderColor = '#50E3C2'
                      const svg = e.currentTarget.querySelector('svg') as SVGElement
                      if (svg) svg.style.color = '#1A1F36'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(36, 42, 69, 0.6)'
                      e.currentTarget.style.borderColor = 'rgba(80, 227, 194, 0.2)'
                      const svg = e.currentTarget.querySelector('svg') as SVGElement
                      if (svg) svg.style.color = 'rgba(242, 244, 248, 0.6)'
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: 'rgba(242, 244, 248, 0.6)', transition: 'color 0.2s' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            style={{
              borderTop: '1px solid rgba(80, 227, 194, 0.1)',
              paddingTop: '24px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: 'rgba(242, 244, 248, 0.4)', fontSize: '14px' }}>
              © {new Date().getFullYear()} SocialAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
