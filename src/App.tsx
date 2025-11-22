import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Feedback from './pages/Feedback/Feedback';
import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import SleepGoal from './pages/Sleep/SleepGoal/SleepGoal';
import SleepTracker from './pages/Sleep/SleepTracker/SleepTracker';
import WaterGoal from './pages/Water/WaterGoal/WaterGoal';
import WaterTracker from './pages/Water/WaterTracker/WaterTracker';
import ActivityList from './pages/Activity/ActivityList/ActivityList';
import AddActivity from './pages/Activity/AddActivity/AddActivity';
import DietList from './pages/Diet/DietList/DietList';
import HobbiesList from './pages/Hobby/HobbiesList/HobbiesList';
import ActivityDetail from './pages/Activity/ActivityDetail/ActivityDetail';
import DietDetail from './pages/Diet/DietDetail/DietDetail';
import HobbyDetail from './pages/Hobby/HobbyDetail/HobbyDetail';
import AIChat from './pages/AIChat/AIChat';
import Insights from './pages/Insights/Insights';
import SleepBenefits from './pages/Sleep/SleepBenefits/SleepBenefits';
import WaterBenefits from './pages/Water/WaterBenefits/WaterBenefits';
import Create from './pages/Create/Create';
import MoodSelection from './pages/Mood/MoodSelection/MoodSelection';
import MoodDetail from './pages/Mood/MoodDetail/MoodDetail';
import MoodDetailView from './pages/Mood/MoodDetailView/MoodDetailView';
import ActivityStopwatch from './pages/Activity/ActivityStopwatch/ActivityStopwatch';
import LogActivity from './pages/Activity/LogActivity/LogActivity';
import DietEntry from './pages/Diet/DietEntry/DietEntry';
import HobbyEntry from './pages/Hobby/HobbyEntry/HobbyEntry';
import UserProfile from './components/auth/UserProfile/UserProfile';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep-goal"
                element={
                  <ProtectedRoute>
                    <SleepGoal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep-tracker"
                element={
                  <ProtectedRoute>
                    <SleepTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/water-goal"
                element={
                  <ProtectedRoute>
                    <WaterGoal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/water-tracker"
                element={
                  <ProtectedRoute>
                    <WaterTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute>
                    <ActivityList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/add"
                element={
                  <ProtectedRoute>
                    <AddActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/stopwatch"
                element={
                  <ProtectedRoute>
                    <ActivityStopwatch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/log"
                element={
                  <ProtectedRoute>
                    <LogActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <Navigate to="/activities" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diets"
                element={
                  <ProtectedRoute>
                    <DietList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hobbies"
                element={
                  <ProtectedRoute>
                    <HobbiesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hobby"
                element={
                  <ProtectedRoute>
                    <Navigate to="/hobbies" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet"
                element={
                  <ProtectedRoute>
                    <Navigate to="/diets" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet/add"
                element={
                  <ProtectedRoute>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        padding: '2rem',
                        textAlign: 'center',
                      }}
                    >
                      <h1>Add Diet Entry</h1>
                      <p>This feature is coming soon!</p>
                      <button
                        onClick={() => (window.location.href = '/diets')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          marginTop: '1rem',
                        }}
                      >
                        Back to Diets
                      </button>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet/entry"
                element={
                  <ProtectedRoute>
                    <DietEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hobby/add"
                element={
                  <ProtectedRoute>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        padding: '2rem',
                        textAlign: 'center',
                      }}
                    >
                      <h1>Add Hobby</h1>
                      <p>This feature is coming soon!</p>
                      <button
                        onClick={() => (window.location.href = '/hobbies')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          marginTop: '1rem',
                        }}
                      >
                        Back to Hobbies
                      </button>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hobby/entry"
                element={
                  <ProtectedRoute>
                    <HobbyEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/:id"
                element={
                  <ProtectedRoute>
                    <ActivityDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet/:id"
                element={
                  <ProtectedRoute>
                    <DietDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hobby/:id"
                element={
                  <ProtectedRoute>
                    <HobbyDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute>
                    <AIChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <Create />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep-benefits"
                element={
                  <ProtectedRoute>
                    <SleepBenefits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/water-benefits"
                element={
                  <ProtectedRoute>
                    <WaterBenefits />
                  </ProtectedRoute>
                }
              />
               <Route
                 path="/mood"
                 element={
                   <ProtectedRoute>
                     <MoodSelection />
                   </ProtectedRoute>
                 }
               />
               <Route
                 path="/mood-detail"
                 element={
                   <ProtectedRoute>
                     <MoodDetail />
                   </ProtectedRoute>
                 }
               />
               <Route
                 path="/mood/:id"
                 element={
                   <ProtectedRoute>
                     <MoodDetailView />
                   </ProtectedRoute>
                 }
               />

              {/* Fallback route for unmatched paths */}
              <Route
                path="*"
                element={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                      padding: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <button
                      onClick={() => (window.location.href = '/dashboard')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginTop: '1rem',
                      }}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                }
              />
            </Routes>
          </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
