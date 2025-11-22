import React from 'react';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import './About.css';

const About: React.FC = () => {
  const features = [
    { icon: '💤', text: 'Track your sleep patterns and improve rest quality' },
    { icon: '💧', text: 'Monitor daily water intake and stay hydrated' },
    { icon: '🏃', text: 'Log activities and workouts to maintain fitness' },
    { icon: '🥗', text: 'Record meals and maintain a healthy diet' },
    { icon: '🎨', text: 'Track hobbies and personal interests' },
    { icon: '🤖', text: 'Get AI-powered health recommendations' },
    { icon: '🔔', text: 'Set reminders and achieve your goals' },
  ];

  const values = [
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is yours. We prioritize your privacy and security above all else.',
    },
    {
      icon: '👥',
      title: 'User-Centric',
      description: 'We build features based on what our users actually need and want.',
    },
    {
      icon: '🚀',
      title: 'Continuous Improvement',
      description: "We're always working to make FitFlow better based on your feedback.",
    },
  ];

  const technologies = [
    { name: 'React', color: '#61dafb' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Firebase', color: '#ffa000' },
    { name: 'Vite', color: '#646cff' },
  ];

  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">About FitFlow</h1>
            <p className="about-hero-subtitle">
              Empowering your health journey through intelligent tracking and personalized insights
            </p>
          </div>
        </section>

        <div className="about-container">
          {/* Mission Section */}
          <section className="about-section mission-section">
            <div className="section-header">
              <div className="section-icon">🎯</div>
              <h2 className="section-title">Our Mission</h2>
            </div>
            <div className="mission-content">
              <p className="mission-text">
                FitFlow is dedicated to helping individuals achieve their health and wellness goals 
                through comprehensive tracking and personalized insights. We believe that small, 
                consistent actions lead to significant improvements in overall well-being.
              </p>
              <div className="mission-highlight">
                <p>
                  <strong>Our goal is simple:</strong> Make health tracking effortless, insightful, 
                  and accessible to everyone, so you can focus on what matters most—your well-being.
                </p>
              </div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="about-section features-section">
            <div className="section-header">
              <div className="section-icon">✨</div>
              <h2 className="section-title">What We Offer</h2>
            </div>
            <p className="section-description">
              FitFlow provides a complete health and habit tracking solution that allows you to:
            </p>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <p className="feature-text">{feature.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className="about-section values-section">
            <div className="section-header">
              <div className="section-icon">💎</div>
              <h2 className="section-title">Our Values</h2>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon-wrapper">
                    <div className="value-icon">{value.icon}</div>
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Section */}
          <section className="about-section technology-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <h2 className="section-title">Built With Modern Technology</h2>
            </div>
            <p className="section-description">
              FitFlow is built with cutting-edge web technologies, ensuring a fast, reliable, 
              and secure experience across all devices.
            </p>
            <div className="tech-stack">
              {technologies.map((tech, index) => (
                <div 
                  key={index} 
                  className="tech-badge"
                  style={{ '--tech-color': tech.color } as React.CSSProperties}
                >
                  {tech.name}
                </div>
              ))}
            </div>
            <div className="tech-description">
              <p>
                Our tech stack enables real-time synchronization, offline capabilities, 
                and a seamless user experience whether you're on desktop, tablet, or mobile.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

