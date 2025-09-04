import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get all bookings with user and trip details
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('tripId', 'name destination price')
      .sort({ createdAt: -1 }); // Latest bookings first
    
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Create new booking (admin can create booking for any user)
export const createBooking = async (req, res) => {
  try {
    const { userId, tripId, guests, travelDate } = req.body;

    // Validate required fields
    if (!userId || !tripId || !guests || !travelDate) {
      return res.status(400).json({ 
        message: "userId, tripId, guests, and travelDate are required" 
      });
    }

    // Validate guests array
    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ 
        message: "At least one guest is required" 
      });
    }

    // Validate each guest has required fields
    for (let guest of guests) {
      if (!guest.name || !guest.age || !guest.passport) {
        return res.status(400).json({ 
          message: "Each guest must have name, age, and passport" 
        });
      }
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.isActive) {
      return res.status(400).json({ message: "Trip is not available" });
    }

    // Calculate total amount (price per person)
    const totalAmount = trip.price * guests.length;

    // Create booking
    const booking = new Booking({
      userId,
      tripId,
      guests,
      totalAmount,
      travelDate: new Date(travelDate)
    });

    await booking.save();

    // Populate the booking before sending response
    await booking.populate('userId', 'name email');
    await booking.populate('tripId', 'name destination price');

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
};


// admin.controller.js
// Add this function to your existing controller
export const getAllTrips = async (req, res) => {
  try {
    // Assuming you have a Trip model
    const trips = await Trip.find({}).select('name destination price duration'); // Adjust fields as needed
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};