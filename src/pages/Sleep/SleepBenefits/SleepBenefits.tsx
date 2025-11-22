import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import './SleepBenefits.css';

const SleepBenefits: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: '🧠',
      title: 'Enhanced Memory',
      description:
        'Sleep helps consolidate memories and improves learning retention.',
    },
    {
      icon: '💪',
      title: 'Better Physical Health',
      description:
        'Adequate sleep strengthens your immune system and helps muscle recovery.',
    },
    {
      icon: '😊',
      title: 'Improved Mood',
      description:
        'Quality sleep regulates emotions and reduces stress and anxiety.',
    },
    {
      icon: '⚡',
      title: 'Increased Energy',
      description:
        'Proper rest restores energy levels and improves daily performance.',
    },
    {
      icon: '🎯',
      title: 'Better Focus',
      description:
        'Good sleep enhances concentration and decision-making abilities.',
    },
    {
      icon: '❤️',
      title: 'Heart Health',
      description:
        'Consistent sleep patterns support cardiovascular health and reduce disease risk.',
    },
  ];

  const tips = [
    'Maintain a consistent sleep schedule, even on weekends',
    'Create a relaxing bedtime routine',
    'Keep your bedroom cool, dark, and quiet',
    'Avoid screens 1 hour before bedtime',
    'Limit caffeine and alcohol before sleep',
    'Exercise regularly, but not too close to bedtime',
  ];

  return (
    <div className="sleep-benefits-page">
      <Header />

      <main className="sleep-benefits-main">
        <div className="sleep-benefits-content">
          <div className="page-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">Sleep Benefits</h1>
          </div>

          <div className="benefits-section">
            <div className="section-header">
              <h2 className="section-title">Why Sleep Matters</h2>
              <p className="section-subtitle">
                Quality sleep is essential for your physical and mental
                well-being
              </p>
            </div>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">
                    <span className="icon-emoji">{benefit.icon}</span>
                  </div>
                  <div className="benefit-content">
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <p className="benefit-description">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tips-section">
            <div className="section-header">
              <h2 className="section-title">Sleep Hygiene Tips</h2>
              <p className="section-subtitle">
                Follow these tips to improve your sleep quality
              </p>
            </div>

            <div className="tips-list">
              {tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <div className="tip-number">{index + 1}</div>
                  <p className="tip-text">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="cycle-section">
            <div className="section-header">
              <h2 className="section-title">Understanding Sleep Cycles</h2>
              <p className="section-subtitle">
                Your sleep consists of different stages that are crucial for
                restoration
              </p>
            </div>

            <div className="cycle-info">
              <div className="cycle-stage">
                <div className="stage-icon">😴</div>
                <div className="stage-content">
                  <h4 className="stage-title">Light Sleep</h4>
                  <p className="stage-description">
                    Transition between wakefulness and sleep
                  </p>
                </div>
              </div>

              <div className="cycle-stage">
                <div className="stage-icon">😴</div>
                <div className="stage-content">
                  <h4 className="stage-title">Deep Sleep</h4>
                  <p className="stage-description">
                    Physical restoration and immune system strengthening
                  </p>
                </div>
              </div>

              <div className="cycle-stage">
                <div className="stage-icon">💭</div>
                <div className="stage-content">
                  <h4 className="stage-title">REM Sleep</h4>
                  <p className="stage-description">
                    Memory consolidation and emotional processing
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              className="track-sleep-button"
              onClick={() => navigate('/sleep-tracker')}
            >
              Track Your Sleep
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SleepBenefits;
