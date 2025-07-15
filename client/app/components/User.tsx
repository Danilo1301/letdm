import React, { createContext, useContext, useState, useEffect } from 'react';

import * as jwtDecodeNS from 'jwt-decode';


interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  // outros campos, se quiser
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  hasInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export interface GoogleJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  iat: number;
  exp: number;
  jti: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const [hasInitialized, setInitialized] = useState(false);

    const updateUser = (partial: Partial<User>) => {
      setUser((prev) => prev ? { ...prev, ...partial } : null);
    };

    const login = (userData: User) => {
        // setUser(userData);
        // localStorage.setItem('user', JSON.stringify(userData)); // opcional
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('google_token');
    };

  // Persistência opcional com localStorage
  useEffect(() => {
    const token = localStorage.getItem('google_token');

    if (token) {
        try {
            const decoded = jwtDecodeNS.jwtDecode(token) as GoogleJwtPayload;

            (window as any)["token"] = decoded;

            const key = localStorage.getItem("letdm_key");

            const user: User = {
              id: decoded.sub,
              name: decoded.name,
              email: decoded.email,
              isAdmin: decoded.sub == "116443845666578173610"
            }

            setUser(user);
        } catch {
            localStorage.removeItem('google_token');
            console.log("token inválido");
        }
    }
    setInitialized(true);
    
  }, []);

  return (
    <UserContext.Provider value={{
        user,
        isLoggedIn: !!user,
        hasInitialized,
        login,
        logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};