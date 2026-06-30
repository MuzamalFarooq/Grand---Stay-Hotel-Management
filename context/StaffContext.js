"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Receptionist",
    department: "Reception",
    salary: "",
    shift: "Morning",
    phone: "",
    email: "",
    image: "",
  });

  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name) return;

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStaff,
          salary: Number(newStaff.salary) || 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchStaff();
        setNewStaff({ name: "", role: "Receptionist", department: "Reception", salary: "", shift: "Morning", phone: "", email: "", image: "" });
        setIsStaffModalOpen(false);
      } else {
        alert(data.error || "Failed to add staff");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to connect to server");
    }
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      const response = await fetch(`/api/staff/${editingStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingStaff.name,
          role: editingStaff.role,
          department: editingStaff.department,
          salary: Number(editingStaff.salary) || 0,
          shift: editingStaff.shift,
          phone: editingStaff.phone,
          email: editingStaff.email,
          status: editingStaff.status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchStaff();
        setEditingStaff(null);
      } else {
        alert(data.error || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleDeleteStaff = async (memberId) => {
    if (!confirm("Remove this staff member?")) return;

    try {
      const response = await fetch(`/api/staff/${memberId}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) await fetchStaff();
      else alert(data.error || "Failed to delete staff");
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const value = {
    staff,
    isStaffModalOpen,
    setIsStaffModalOpen,
    editingStaff,
    setEditingStaff,
    newStaff,
    setNewStaff,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    fetchStaff,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};
