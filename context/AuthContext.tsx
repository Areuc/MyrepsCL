
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (updatedUserData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged-in user in localStorage on initial load
    const storedUser = localStorage.getItem('fitnessAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    // Simulate API call / validation
    // In a real app, you'd fetch user data from a backend
    // For this demo, we'll check against localStorage if a user exists with this email.
    // This is NOT secure and for demo purposes only.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('fitnessAppRegisteredUsers') || '[]') as (User & {password: string})[];
        const foundUser = storedUsers.find(u => u.email === email);

        if (foundUser && foundUser.password === password) { // Simple password check (unsafe)
          const userToStore: User = { id: foundUser.id, email: foundUser.email, name: foundUser.name, goal: foundUser.goal };
          localStorage.setItem('fitnessAppUser', JSON.stringify(userToStore));
          setUser(userToStore);
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Credenciales inválidas. Por favor, inténtalo de nuevo.'));
        }
      }, 1000);
    });
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setLoading(true);
    // Simulate API call / user creation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let storedUsers = JSON.parse(localStorage.getItem('fitnessAppRegisteredUsers') || '[]') as (User & {password: string})[];
        if (storedUsers.find(u => u.email === email)) {
            setLoading(false);
            reject(new Error('Este correo electrónico ya está registrado.'));
            return;
        }

        const newUser: User & {password: string} = { 
            id: Date.now().toString(), 
            email, 
            name, 
            password, // Storing password directly is INSECURE. Hash in real app.
            goal: undefined // Default goal
        };
        storedUsers.push(newUser);
        localStorage.setItem('fitnessAppRegisteredUsers', JSON.stringify(storedUsers));
        
        const userToStore: User = { id: newUser.id, email: newUser.email, name: newUser.name, goal: newUser.goal };
        localStorage.setItem('fitnessAppUser', JSON.stringify(userToStore));
        setUser(userToStore);
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('fitnessAppUser');
    setUser(null);
  };
  
  const updateUser = async (updatedUserData: Partial<User>): Promise<void> => {
    if (!user) throw new Error("No user to update");
    setLoading(true);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUserData = { ...user, ...updatedUserData };
            setUser(newUserData);
            localStorage.setItem('fitnessAppUser', JSON.stringify(newUserData));
            
            // Also update in the "registered users" list for persistence across sessions
            let storedUsers = JSON.parse(localStorage.getItem('fitnessAppRegisteredUsers') || '[]') as (User & {password?: string})[];
            storedUsers = storedUsers.map(u => u.id === newUserData.id ? {...u, ...newUserData} : u);
            localStorage.setItem('fitnessAppRegisteredUsers', JSON.stringify(storedUsers));

            setLoading(false);
            resolve();
        }, 500);
    });
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
