import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import './WaterBenefits.css';

const WaterBenefits: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: '💧',
      title: 'Optimal Hydration',
      description:
        'Water maintains proper fluid balance and supports all bodily functions.',
    },
    {
      icon: '🧠',
      title: 'Brain Function',
      description:
        'Proper hydration improves concentration, memory, and cognitive performance.',
    },
    {
      icon: '💪',
      title: 'Physical Performance',
      description:
        'Adequate water intake enhances endurance and reduces fatigue during exercise.',
    },
    {
      icon: '🌡️',
      title: 'Temperature Regulation',
      description:
        'Water helps regulate body temperature through sweating and respiration.',
    },
    {
      icon: '🩸',
      title: 'Blood Circulation',
      description:
        'Proper hydration maintains blood volume and supports cardiovascular health.',
    },
    {
      icon: '🦴',
      title: 'Joint Health',
      description:
        'Water lubricates joints and cushions organs for better mobility.',
    },
  ];

  const tips = [
    'Drink water first thing in the morning to kickstart hydration',
    'Carry a water bottle with you throughout the day',
    'Set hourly reminders to drink water',
    'Eat water-rich foods like fruits and vegetables',
    'Monitor your urine color - pale yellow indicates good hydration',
    'Drink water before, during, and after exercise',
  ];

  const guidelines = [
    {
      amount: '2-3 liters',
      description: 'General daily recommendation for adults',
    },
    {
      amount: '3-4 liters',
      description: 'For active individuals or hot climates',
    },
    { amount: '1.5-2 liters', description: 'Minimum for sedentary adults' },
    { amount: '500ml', description: 'Extra water per hour of exercise' },
  ];

  return (
    <div className="water-benefits-page">
      <Header />

      <main className="water-benefits-main">
        <div className="water-benefits-content">
          <div className="page-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">Water Benefits</h1>
          </div>

          <div className="benefits-section">
            <div className="section-header">
              <h2 className="section-title">Why Hydration Matters</h2>
              <p className="section-subtitle">
                Water is essential for life and plays a crucial role in
                maintaining your health
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

          <div className="guidelines-section">
            <div className="section-header">
              <h2 className="section-title">Daily Water Intake Guidelines</h2>
              <p className="section-subtitle">
                Recommended water consumption based on your lifestyle
              </p>
            </div>

            <div className="guidelines-grid">
              {guidelines.map((guideline, index) => (
                <div key={index} className="guideline-card">
                  <div className="guideline-amount">{guideline.amount}</div>
                  <p className="guideline-description">
                    {guideline.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="tips-section">
            <div className="section-header">
              <h2 className="section-title">Hydration Tips</h2>
              <p className="section-subtitle">
                Simple strategies to stay hydrated throughout the day
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

          <div className="signs-section">
            <div className="section-header">
              <h2 className="section-title">Signs of Dehydration</h2>
              <p className="section-subtitle">
                Watch out for these warning signs that you need more water
              </p>
            </div>

            <div className="signs-grid">
              <div className="sign-item">
                <div className="sign-icon">😴</div>
                <p className="sign-text">Fatigue and tiredness</p>
              </div>
              <div className="sign-item">
                <div className="sign-icon">🤕</div>
                <p className="sign-text">Headaches</p>
              </div>
              <div className="sign-item">
                <div className="sign-icon">😵</div>
                <p className="sign-text">Dizziness</p>
              </div>
              <div className="sign-item">
                <div className="sign-icon">💛</div>
                <p className="sign-text">Dark yellow urine</p>
              </div>
              <div className="sign-item">
                <div className="sign-icon">👄</div>
                <p className="sign-text">Dry mouth and lips</p>
              </div>
              <div className="sign-item">
                <div className="sign-icon">🧠</div>
                <p className="sign-text">Difficulty concentrating</p>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              className="track-water-button"
              onClick={() => navigate('/water-tracker')}
            >
              Track Your Water Intake
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaterBenefits;
