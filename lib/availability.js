import Booking from "@/models/Booking";

/**
 * Check if a room is available for the given date range.
 * Prevents double-booking by detecting overlapping active reservations.
 */
export async function isRoomAvailable(roomId, checkInDate, checkOutDate, excludeBookingId = null) {
  const query = {
    roomId,
    isCompleted: false,
    bookingStatus: { $nin: ["Cancelled", "CheckedOut"] },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query);
  return !conflict;
}

export function calcNights(checkInDate, checkOutDate) {
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export function calcTotalPrice(pricePerNight, checkInDate, checkOutDate) {
  return calcNights(checkInDate, checkOutDate) * pricePerNight;
}
