import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import CreateOptions from '../../components/create/CreateOptions/CreateOptions';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import './Create.css';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleOptionClick = (option: string) => {
    const routeMap: { [key: string]: string } = {
      activity: '/activities',
      diet: '/diets',
      hobby: '/hobbies',
      mood: '/mood',
    };

    const route = routeMap[option] || `/${option}`;
    
    // Pass today's date for pages that need it
    if (option === 'activity' || option === 'diet') {
      const todayDate = formatDate(new Date());
      navigate(route, {
        state: { selectedDate: todayDate }
      });
    } else {
      navigate(route);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="create-page">
      <Header />

      <main className="create-main">
        <div className="create-content">
          {/* Header Section */}
          <div className="create-header">
            <button className="back-arrow" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>

            <h1 className="create-title">Create</h1>

            <div className="header-spacer"></div>
          </div>

          <CreateOptions onOptionClick={handleOptionClick} />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Create;
