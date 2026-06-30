"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const threeDaysLater = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(threeDaysLater);
  const [newRoom, setNewRoom] = useState({
    id: "",
    type: "Standard",
    price: "",
    roomName: "",
    description: "",
    maxGuests: 2,
    bedType: "Queen",
    floor: 1,
  });

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(
          data.data.sort((a, b) => parseInt(a.id) - parseInt(b.id))
        );
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  const resetBookingForm = () => {
    setCustomerName("");
    setEmail("");
    setIdCard("");
    setPhoneNumber("");
    setGuests(1);
    setSpecialRequests("");
    setCheckInDate(today);
    setCheckOutDate(threeDaysLater);
    setSelectedRoom(null);
  };

  const handleBookRoom = async () => {
    if (!customerName || !selectedRoom || !phoneNumber || !checkInDate || !checkOutDate) return false;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom._id,
          roomNumber: selectedRoom.id,
          customerName,
          email,
          idCard,
          phone: phoneNumber,
          phoneNumber,
          checkInDate,
          checkOutDate,
          guests,
          specialRequests,
          paymentStatus: "Paid",
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        await fetchBookings();
        resetBookingForm();
        return true;
      }
      alert(data.error || "Failed to save booking");
      return false;
    } catch (error) {
      console.error("Error booking room:", error);
      alert("Failed to save booking");
      return false;
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout" }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        await fetchBookings();
      }
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: "Cancelled" }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        await fetchBookings();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.id || !newRoom.price) return;

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: newRoom.id,
          roomName: newRoom.roomName || `Room ${newRoom.id}`,
          roomType: newRoom.type,
          pricePerNight: Number(newRoom.price),
          description: newRoom.description,
          maxGuests: newRoom.maxGuests,
          bedType: newRoom.bedType,
          floor: newRoom.floor,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        setNewRoom({ id: "", type: "Standard", price: "", roomName: "", description: "", maxGuests: 2, bedType: "Queen", floor: 1 });
        setIsRoomModalOpen(false);
      } else {
        alert(data.error || "Failed to add room");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to connect to server");
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const response = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editingRoom._id,
          roomNumber: editingRoom.id,
          roomName: editingRoom.roomName,
          roomType: editingRoom.type,
          pricePerNight: Number(editingRoom.price),
          description: editingRoom.description,
          maxGuests: editingRoom.maxGuests,
          bedType: editingRoom.bedType,
          floor: editingRoom.floor,
          availabilityStatus: editingRoom.status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        setEditingRoom(null);
      } else {
        alert(data.error || "Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!confirm(`Delete room ${room.id}?`)) return;

    try {
      const response = await fetch(`/api/rooms?id=${room._id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        await fetchRooms();
        setSelectedRoom(null);
      } else {
        alert(data.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleMarkAvailable = async (roomId) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber: roomId, availabilityStatus: "Available" }),
      });
      const data = await response.json();
      if (data.success) await fetchRooms();
    } catch (error) {
      console.error("Error marking room available:", error);
    }
  };

  const availableRoomsCount = rooms.filter((r) => r.status === "Available").length;
  const maintenanceRoomsCount = rooms.filter((r) => r.status === "Maintenance").length;
  const totalRoomsCount = rooms.length;

  const value = {
    rooms,
    bookings,
    loading,
    selectedRoom,
    setSelectedRoom,
    isRoomModalOpen,
    setIsRoomModalOpen,
    editingRoom,
    setEditingRoom,
    customerName,
    setCustomerName,
    email,
    setEmail,
    idCard,
    setIdCard,
    phoneNumber,
    setPhoneNumber,
    guests,
    setGuests,
    specialRequests,
    setSpecialRequests,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    newRoom,
    setNewRoom,
    handleBookRoom,
    handleCheckOut,
    handleCancelBooking,
    handleAddRoom,
    handleEditRoom,
    handleDeleteRoom,
    handleMarkAvailable,
    fetchRooms,
    fetchBookings,
    availableRoomsCount,
    maintenanceRoomsCount,
    totalRoomsCount,
    today,
    threeDaysLater,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
