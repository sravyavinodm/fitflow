import React from 'react';
import LoginForm from '../../../components/auth/LoginForm/LoginForm';
import '../../../styles/components/auth.css';

const Login: React.FC = () => {
  return (
    <div className="auth-container">
      <LoginForm />
    </div>
  );
};

export default Login;
