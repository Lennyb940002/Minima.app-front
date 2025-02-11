import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/loading/LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requirePayment?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requirePayment = true,
}) => {
    const { isAuthenticated, hasPaid, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requirePayment && !hasPaid) {
        return <Navigate to="/subscription" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
