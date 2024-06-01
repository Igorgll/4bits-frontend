import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_ESTOQUISTA';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userRole: UserRole | null;
  login: (email: string, token: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole") as UserRole | null;
    if (token && email && role) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  const login = (email: string, token: string, role: UserRole) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};