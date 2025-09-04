import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  passport: {
    type: String,
    required: true,
    trim: true,
  }
});

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    guests: [guestSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial', 'Refunded'],
      default: 'Pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ tripId: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ travelDate: 1 });

export default mongoose.model("Booking", bookingSchema);