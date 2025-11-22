import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import './Feedback.css';

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    rating: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', type: '', rating: '', message: '' });
    }, 3000);
  };

  return (
    <div className="feedback-page">
      <Header />
      <main className="feedback-main">
        <div className="feedback-container">
          <h1 className="feedback-title">Share Your Feedback</h1>
          <p className="feedback-subtitle">
            Your feedback helps us improve FitFlow. We value your thoughts and suggestions!
          </p>

          <form className="feedback-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="form-success">
                Thank you for your feedback! We appreciate you taking the time to share your thoughts.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name (Optional)</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Feedback Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="ui">UI/UX Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Overall Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Very Good</option>
                  <option value="3">⭐⭐⭐ Good</option>
                  <option value="2">⭐⭐ Fair</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Feedback</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
                placeholder="Please share your thoughts, suggestions, or report any issues..."
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Submit Feedback
            </button>
          </form>

          <div className="feedback-info">
            <h2>What Happens Next?</h2>
            <ul>
              <li>We review all feedback regularly</li>
              <li>Popular feature requests are prioritized for development</li>
              <li>Bug reports are investigated and fixed promptly</li>
              <li>We may reach out for more details if you provide contact information</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;

