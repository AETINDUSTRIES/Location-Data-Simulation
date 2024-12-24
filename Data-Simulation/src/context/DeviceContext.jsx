import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./UserContext";
import config from "../config";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const { token, setToken, user, loading: userLoading } = useUserContext();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user || !token || userLoading) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${config.baseUrl}:8443/test/trackAPI/device/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDevices(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setToken(null);
        }
        setError(
          err.response?.data?.message ||
            "Failed to fetch devices. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user, token, userLoading]);

  return (
    <DeviceContext.Provider value={{ devices, loading, error }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => useContext(DeviceContext);
