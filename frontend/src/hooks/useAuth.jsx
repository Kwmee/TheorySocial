import { createContext, useContext, useEffect, useState } from "react";
import {
  acceptTerms as acceptTermsRequest,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      try {
        const currentUser = await fetchCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch (error) {
        if (active && error.status !== 401 && error.status !== 403) {
          console.error(error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const authenticatedUser = await loginRequest(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const signup = async (payload) => {
    const authenticatedUser = await signupRequest(payload);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const acceptTerms = async () => {
    const updatedUser = await acceptTermsRequest();
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        acceptTerms,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
