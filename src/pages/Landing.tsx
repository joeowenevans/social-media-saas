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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(80, 227, 194, 0.3), 0 0 40px rgba(80, 227, 194, 0.2); }
          50% { box-shadow: 0 0 30px rgba(80, 227, 194, 0.5), 0 0 60px rgba(80, 227, 194, 0.3); }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(80, 227, 194, 0.6), 0 0 40px rgba(80, 227, 194, 0.4); }
          50% { text-shadow: 0 0 30px rgba(80, 227, 194, 0.8), 0 0 60px rgba(80, 227, 194, 0.5), 0 0 80px rgba(80, 227, 194, 0.3); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
          animation: text-glow 3s ease-in-out infinite;
        }
        .cta-button {
          animation: pulse-glow 2s ease-in-out infinite;
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
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem !important; }
          .hero-subtitle { font-size: 1.125rem !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .cta-buttons { flex-direction: column !important; width: 100% !important; }
          .cta-buttons a { width: 100% !important; }
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
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

            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                to="/login"
                style={{
                  padding: '10px 20px',
                  color: 'rgba(242, 244, 248, 0.8)',
                  fontWeight: 500,
                  fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.8)'}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '12px 28px',
                  background: '#50E3C2',
                  color: '#1A1F36',
                  fontWeight: 600,
                  fontSize: '15px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 0 20px rgba(80, 227, 194, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2979FF'
                  e.currentTarget.style.color = '#FFFFFF'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(41, 121, 255, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#50E3C2'
                  e.currentTarget.style.color = '#1A1F36'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(80, 227, 194, 0.3)'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '100px 24px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'rgba(80, 227, 194, 0.1)',
              border: '1px solid rgba(80, 227, 194, 0.3)',
              borderRadius: '50px',
              marginBottom: '32px'
            }}
          >
            <Sparkles style={{ width: '18px', height: '18px', color: '#50E3C2' }} />
            <span style={{ color: '#50E3C2', fontWeight: 600, fontSize: '14px' }}>Powered by GPT-4 Vision AI</span>
          </div>

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
            AI-Powered Social Media
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: '1.35rem',
              color: 'rgba(242, 244, 248, 0.7)',
              maxWidth: '700px',
              margin: '0 auto 48px',
              lineHeight: 1.7
            }}
          >
            Upload your content, let AI craft perfect captions, and schedule posts
            across all platforms. Your social media manager, powered by AI.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '32px' }}>
            <Link
              to="/signup"
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
              Start Free Trial
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 40px',
                background: 'rgba(36, 42, 69, 0.8)',
                border: '1px solid rgba(80, 227, 194, 0.3)',
                color: '#F2F4F8',
                fontSize: '18px',
                fontWeight: 600,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#50E3C2'
                e.currentTarget.style.background = 'rgba(80, 227, 194, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(80, 227, 194, 0.3)'
                e.currentTarget.style.background = 'rgba(36, 42, 69, 0.8)'
              }}
            >
              View Demo
            </Link>
          </div>

          {/* Trust Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
            <span style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '15px' }}>
              10 posts free • No credit card required
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px 120px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
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
            <p style={{ fontSize: '1.2rem', color: 'rgba(242, 244, 248, 0.6)', maxWidth: '600px', margin: '0 auto' }}>
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
              { icon: Wand2, title: 'AI Caption Generation', desc: 'GPT-4 Vision analyses your content and creates engaging captions tailored to your brand voice.' },
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Schedule posts across Instagram, Facebook, and Pinterest with our intuitive calendar.' },
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

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: 'rgba(36, 42, 69, 0.4)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
            {[
              { value: '10K+', label: 'Posts Scheduled' },
              { value: '500+', label: 'Happy Users' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    color: '#50E3C2',
                    marginBottom: '8px',
                    textShadow: '0 0 30px rgba(80, 227, 194, 0.5)'
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '16px', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#F2F4F8', marginBottom: '16px' }}>
              Simple, <span style={{ color: '#50E3C2' }}>Transparent</span> Pricing
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(242, 244, 248, 0.6)' }}>
              Start free, upgrade when you're ready
            </p>
          </div>

          {/* Pricing Card */}
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(36, 42, 69, 0.9) 0%, rgba(26, 31, 54, 0.9) 100%)',
              border: '2px solid #50E3C2',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 0 60px rgba(80, 227, 194, 0.2), 0 0 100px rgba(80, 227, 194, 0.1)'
            }}
          >
            {/* Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #50E3C2 0%, #3dd4b0 100%)',
                color: '#1A1F36',
                padding: '8px 24px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Most Popular
            </div>

            <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#F2F4F8', marginBottom: '8px', marginTop: '8px' }}>
              Pro Plan
            </h3>
            <div style={{ marginBottom: '32px' }}>
              <span
                className="gradient-text"
                style={{ fontSize: '4rem', fontWeight: 800 }}
              >
                $29
              </span>
              <span style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '1.25rem', marginLeft: '8px' }}>/month</span>
            </div>

            {/* Features List */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0' }}>
              {[
                'Unlimited posts',
                'AI caption generation',
                'Multi-platform scheduling',
                'Brand voice customisation',
                'Priority support'
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 0',
                    borderBottom: i < 4 ? '1px solid rgba(80, 227, 194, 0.1)' : 'none'
                  }}
                >
                  <CheckCircle2 style={{ width: '22px', height: '22px', color: '#50E3C2', flexShrink: 0 }} />
                  <span style={{ color: '#F2F4F8', fontSize: '16px', fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to="/signup"
              style={{
                display: 'block',
                width: '100%',
                padding: '18px',
                background: '#50E3C2',
                color: '#1A1F36',
                fontSize: '18px',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 30px rgba(80, 227, 194, 0.3)'
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
              Start Free Trial
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginBottom: '48px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
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
                AI-powered social media management made simple. Create, schedule, and optimise your content effortlessly.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ color: '#F2F4F8', fontWeight: 600, marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quick Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <div style={{ display: 'flex', gap: '12px' }}>
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
