import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { setAuthToken, clearAuthToken, onAuthFailure } from "../api/client";
import { login, register, getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function completeAuthentication({ token, user }) {
    setAuthToken(token);
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
