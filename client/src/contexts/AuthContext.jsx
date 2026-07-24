import { createContext, useState, useCallback, useEffect } from "react";

import { clearAuthToken, setAuthToken, onAuthFailure } from "../api/client";
import { getCurrentUser, login, register } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        setAuthToken(token);
        const { user } = await getCurrentUser();
        setUser(user);
      } catch {
        signOut();
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();

    const unsubscribe = onAuthFailure(signOut);

    return unsubscribe;
  }, [signOut]);

  function setSession({ token, user }) {
    setAuthToken(token);
    setUser(user);
  }

  async function signIn(credentials) {
    const response = await login(credentials);
    setSession(response);
  }

  async function signUp(credentials) {
    const response = await register(credentials);
    setSession(response);
  }

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
