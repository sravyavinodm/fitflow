import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import CalendarPreview from '../../components/dashboard/CalendarPreview/CalendarPreview';
import SchedulesSection from '../../components/dashboard/SchedulesSection/SchedulesSection';
import HealthDetails from '../../components/dashboard/HealthDetails/HealthDetails';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { getTimeBasedGreeting } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <LoadingSpinner overlay text="Loading dashboard..." />;
  }

  if (!currentUser) {
    return (
      <div className="dashboard-error">
        <h2>Please log in to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <h2>{getTimeBasedGreeting()}, {userProfile?.displayName || 'User'}!</h2>
            <p>Track your health journey and stay on top of your goals.</p>
          </div>

          <div className="dashboard-sections">
            <CalendarPreview />
            <SchedulesSection />
            <HealthDetails />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
