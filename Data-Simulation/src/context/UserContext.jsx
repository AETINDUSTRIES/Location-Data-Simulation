import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true); // Indicate loading state

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Initialization complete
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(
        `${config.baseUrl}/trackAPI/auth/signin`,
        {
          email,
          password,
        }
      );
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      setAuthError(
        error.response?.data?.message ||
          "Failed to authenticate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setToken,
        signIn,
        signOut,
        authError,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
