export function serializeRoom(room) {
  const doc = room.toObject ? room.toObject({ virtuals: true }) : room;
  return {
    ...doc,
    _id: doc._id?.toString(),        // ← stringify ObjectId to plain string
    id: doc.roomNumber,
    type: doc.roomType,
    price: doc.pricePerNight,
    status: doc.availabilityStatus,
  };
}

export function serializeBooking(booking) {
  const doc = booking.toObject ? booking.toObject() : booking;
  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
    room: doc.roomNumber,
    customer: doc.customerName,
    checkIn: doc.checkInDate,
    checkOut: doc.checkOutDate,
    phoneNumber: doc.phone || doc.phoneNumber,
  };
}

export function serializeStaff(member) {
  const doc = member.toObject ? member.toObject() : member;
  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
  };
}

export function serializeCustomer(customer) {
  const doc = customer.toObject ? customer.toObject() : customer;
  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
  };
}
