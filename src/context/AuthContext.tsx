import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    selectedPlan: Plan | null;
    setSelectedPlan: (plan: Plan | null) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;
    hasPaid: boolean;
    setHasPaid: (value: boolean) => void;
    isLoading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    selectedPlan: null,
    setSelectedPlan: () => { },
    userEmail: '',
    setUserEmail: () => { },
    hasPaid: false,
    setHasPaid: () => { },
    isLoading: true,
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [userEmail, setUserEmail] = useState('');
    const [hasPaid, setHasPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const storedEmail = localStorage.getItem('userEmail');
            const paymentStatus = localStorage.getItem('hasPaid');
            const storedPlan = localStorage.getItem('selectedPlan');

            if (token) {
                setIsAuthenticated(true);
                setUserEmail(storedEmail || '');
                setHasPaid(paymentStatus === 'true');
                if (storedPlan) {
                    setSelectedPlan(JSON.parse(storedPlan));
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('hasPaid', String(hasPaid));
            if (selectedPlan) {
                localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
            }
        }
    }, [isAuthenticated, userEmail, hasPaid, selectedPlan]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('hasPaid');
        localStorage.removeItem('selectedPlan');
        setIsAuthenticated(false);
        setUserEmail('');
        setHasPaid(false);
        setSelectedPlan(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                selectedPlan,
                setSelectedPlan,
                userEmail,
                setUserEmail,
                hasPaid,
                setHasPaid,
                isLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
