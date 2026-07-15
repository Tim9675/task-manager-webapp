import { createContext, useContext, useEffect, useState } from "react";

import { login, register, getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function completeAuthentication({ token, user }) {
    localStorage.setItem("token", token);
    setUser(user);
  }

  async function signIn(credentials) {
    const response = await login(credentials);
    completeAuthentication(response);
  }

  async function signUp(credentials) {
    const response = await register(credentials);
    completeAuthentication(response);
  }

  function signOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token"); // Prevents broken sessions
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
