import React from 'react';
import RegisterForm from '../../../components/auth/RegisterForm/RegisterForm';
import '../../../styles/components/auth.css';

const Register: React.FC = () => {
  return (
    <div className="auth-container">
      <RegisterForm />
    </div>
  );
};

export default Register;
