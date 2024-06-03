import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_ESTOQUISTA';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userRole: UserRole | null;
  userName: string | null;
  authToken: string | null;
  login: (email: string, token: string, role: UserRole, name: string) => void;
  logout: () => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole") as UserRole | null;
    const name = localStorage.getItem("userName");
    if (token && email && role && name) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserRole(role);
      setUserName(name);
      setAuthToken(token);
    }
  }, []);

  const login = (email: string, token: string, role: UserRole, name: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
    setUserName(name);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    setUserName(null);
    setAuthToken(null);
  };

  const logoutAdmin = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    setUserName(null);
    setAuthToken(null);
    try {
      const response = await fetch('http://localhost:8080/api/v1/admins/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to logout admin');
      }
    } catch (error) {
      console.error('Admin logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userRole, userName, authToken, login, logout, logoutAdmin }}>
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
