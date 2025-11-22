import React from 'react';
import ForgotPasswordForm from '../../../components/auth/ForgotPassword/ForgotPassword';
import '../../../styles/components/auth.css';

const ForgotPassword: React.FC = () => {
  return (
    <div className="auth-container">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
