import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { EcommerceDashboard } from './components/dashboard/EcommerceDashboard';
import { SubscriptionPlans } from './components/auth/SubscriptionPlans';
import PaymentForm from './components/auth/PaymentForm';
import { LoadingScreen } from './components/loading/LoadingScreen';
import { useAuth } from './context/AuthContext';

const MainContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPublicPage = ['/auth', '/subscription', '/payment', '/loading'].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-black text-white fade-in">
      {!isPublicPage && isAuthenticated && <Header />}
      <main className="max-w-7xl mx-auto py-8">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/ecommerce' : '/auth'} replace />
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute requirePayment={false}>
                <SubscriptionPlans />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthFormContainer />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute requirePayment={false}>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route
            path="/ecommerce"
            element={
              <ProtectedRoute>
                <EcommerceDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const AuthFormContainer = () => {
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  const { setIsAuthenticated, setUserEmail, hasPaid } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || (hasPaid ? '/ecommerce' : '/subscription');

  const handleSubmit = (email: string) => {
    const token = 'fake-jwt-token'; // Dans un vrai cas, ce serait le token JWT du backend
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUserEmail(email);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <AuthForm
        type={authType}
        onSwitch={() => setAuthType(authType === 'login' ? 'register' : 'login')}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
