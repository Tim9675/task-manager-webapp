import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.log(error);
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
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
