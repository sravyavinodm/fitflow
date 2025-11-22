import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: '💤',
      title: 'Sleep Tracking',
      description: 'Monitor your sleep patterns and set goals to improve your rest quality.',
    },
    {
      icon: '💧',
      title: 'Water Intake',
      description: 'Track your daily water consumption and stay hydrated throughout the day.',
    },
    {
      icon: '🏃',
      title: 'Activity Management',
      description: 'Log your workouts, activities, and track your fitness progress over time.',
    },
    {
      icon: '🥗',
      title: 'Diet Tracking',
      description: 'Record your meals and maintain a healthy eating routine.',
    },
    {
      icon: '🎨',
      title: 'Hobbies & Interests',
      description: 'Track your hobbies and personal interests to maintain work-life balance.',
    },
    {
      icon: '📅',
      title: 'Calendar Integration',
      description: 'Visual calendar view of all your health and activity entries.',
    },
    {
      icon: '🤖',
      title: 'AI Chat Assistant',
      description: 'Get personalized health recommendations and guidance from AI.',
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Set reminders for your goals and habits to stay on track.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your free account in seconds',
    },
    {
      number: '2',
      title: 'Set Goals',
      description: 'Define your health and wellness objectives',
    },
    {
      number: '3',
      title: 'Start Tracking',
      description: 'Begin logging your activities and progress',
    },
    {
      number: '4',
      title: 'Stay Motivated',
      description: 'View insights and achieve your goals',
    },
  ];

  return (
    <div className="home-page">
      <Header />
      
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Complete Health & Habit Tracker
            </h1>
            <p className="hero-description">
              Track your sleep, water intake, activities, diet, and more. 
              Build healthy habits and achieve your wellness goals with FitFlow.
            </p>
            <div className="hero-cta">
              <button 
                className="cta-button primary" 
                onClick={handleGetStarted}
              >
                {currentUser ? 'Go to Dashboard' : 'Get Started Free'}
              </button>
              {!currentUser && (
                <button 
                  className="cta-button secondary" 
                  onClick={handleLogin}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-dot"></div>
                <div className="hero-card-dot"></div>
                <div className="hero-card-dot"></div>
              </div>
              <div className="hero-card-content">
                <div className="hero-card-item">
                  <span className="hero-card-icon">💤</span>
                  <span>Sleep: 8h 30m</span>
                </div>
                <div className="hero-card-item">
                  <span className="hero-card-icon">💧</span>
                  <span>Water: 6/8 glasses</span>
                </div>
                <div className="hero-card-item">
                  <span className="hero-card-icon">🏃</span>
                  <span>Activity: 45 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-container">
            <h2 className="section-title">Everything You Need to Track Your Health</h2>
            <p className="section-subtitle">
              Comprehensive tools to monitor and improve your wellness journey
            </p>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-container">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get started in minutes and begin your wellness journey
            </p>
            <div className="steps-container">
              {steps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="section-container">
            <h2 className="section-title">Why Choose FitFlow?</h2>
            <p className="section-subtitle">
              Experience the difference with our comprehensive health tracking platform
            </p>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">📊</div>
                </div>
                <h3 className="benefit-title">Data-Driven Insights</h3>
                <p className="benefit-description">Visualize your progress with comprehensive charts and analytics to make informed decisions about your health.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">🔒</div>
                </div>
                <h3 className="benefit-title">Privacy First</h3>
                <p className="benefit-description">Your data is encrypted and secure. We prioritize your privacy and never share your information.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">📱</div>
                </div>
                <h3 className="benefit-title">Works Everywhere</h3>
                <p className="benefit-description">Access your data seamlessly on any device, anytime. Your health journey follows you everywhere.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">⚡</div>
                </div>
                <h3 className="benefit-title">Real-Time Sync</h3>
                <p className="benefit-description">Your data syncs instantly across all devices, ensuring you always have the latest information at your fingertips.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!currentUser && (
          <section className="cta-section">
            <div className="section-container">
              <h2 className="cta-title">Ready to Start Your Journey?</h2>
              <p className="cta-description">
                Join thousands of users tracking their health and building better habits
              </p>
              <button className="cta-button primary large" onClick={handleGetStarted}>
                Get Started Free
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;

