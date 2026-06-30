"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchServices();
  }, [fetchCustomers, fetchServices]);

  const value = {
    customers,
    services,
    loading,
    fetchCustomers,
    fetchServices,
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};
