import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../../services/admin";
import "./ViewBooking.css";

const ViewBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const bookingData = await getBookingById(id);
      console.log("Booking details:", bookingData);
      setBooking(bookingData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/bookings");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed") return "confirmed";
    if (statusLower === "pending") return "pending";
    if (statusLower === "cancelled") return "cancelled";
    if (statusLower === "completed") return "completed";
    if (statusLower === "paid") return "confirmed";
    if (statusLower === "refunded") return "cancelled";
    return "pending";
  };

  if (loading) {
    return (
      <div className="view-booking-container">
        <div className="loading">Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-booking-container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchBookingDetails} className="retry-btn">
            Try Again
          </button>
          <button onClick={handleBack} className="back-btn-error">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="view-booking-container">
        <div className="error">Booking not found</div>
      </div>
    );
  }

  return (
    <div className="view-booking-container">
      {/* Header */}
      <div className="view-booking-header">
        <button onClick={handleBack} className="back-btn">
          <span>←</span> Back to Bookings
        </button>
        <div className="header-info">
          <h1>Booking Details</h1>
          <p className="booking-id">ID: {booking.bookingId}</p>
        </div>
        <div
          className={`status-badge ${getStatusColor(booking.bookingStatus)}`}
        >
          {booking.bookingStatus || "Pending"}
        </div>
      </div>

      {/* Main Content */}
      <div className="booking-details-content">
        {/* Customer Information */}
        <div className="details-section">
          <h2 className="section-title">Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>User ID</label>
              <p className="user-id">{booking.userId?._id || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Name</label>
              <p>{booking.userId?.name || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{booking.userId?.email || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{booking.userId?.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="details-section">
          <h2 className="section-title">Trip Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Trip ID</label>
              <p className="trip-id">{booking.tripId?._id || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Trip Name</label>
              <p>{booking.tripId?.name || "Trip Deleted"}</p>
            </div>
            <div className="info-item">
              <label>Destination</label>
              <p>{booking.tripId?.destination || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Trip Price (per person)</label>
              <p className="price">${booking.tripId?.price || 0}</p>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="details-section">
          <h2 className="section-title">Booking Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>MongoDB ID</label>
              <p className="booking-id-field">{booking._id || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Booking ID</label>
              <p className="booking-id-field">{booking.bookingId || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Booking Date</label>
              <p>{formatDate(booking.bookingDate)}</p>
            </div>
            <div className="info-item">
              <label>Total Guests</label>
              <p className="guest-count">{booking.guests?.length || 0}</p>
            </div>
            <div className="info-item">
              <label>Booking Status</label>
              <p>
                <span
                  className={`status-badge ${getStatusColor(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus || "Pending"}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Payment Status</label>
              <p>
                <span
                  className={`payment-badge ${getStatusColor(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus || "Pending"}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Acknowledged</label>
              <p>
                <span
                  className={`acknowledge-badge ${
                    booking.acknowledge ? "yes" : "no"
                  }`}
                >
                  {booking.acknowledge ? "Yes" : "No"}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Created At</label>
              <p>{formatDateTime(booking.createdAt)}</p>
            </div>
            <div className="info-item">
              <label>Last Updated</label>
              <p>{formatDateTime(booking.updatedAt)}</p>
            </div>
            {booking.__v !== undefined && (
              <div className="info-item">
                <label>Version</label>
                <p>{booking.__v}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        {booking.registrationPaymentDetails && (
          <div className="details-section payment-section">
            <h2 className="section-title">Registration Payment Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Transaction ID</label>
                <p className="transaction-id">
                  {booking.registrationPaymentDetails.transactionId || "N/A"}
                </p>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <p>
                  <span
                    className={`payment-badge ${getStatusColor(
                      booking.registrationPaymentDetails.status
                    )}`}
                  >
                    {booking.registrationPaymentDetails.status || "Pending"}
                  </span>
                </p>
              </div>
              <div className="info-item">
                <label>Amount</label>
                <p className="price">
                  {booking.registrationPaymentDetails.currency || "USD"} $
                  {booking.registrationPaymentDetails.amount || 0}
                </p>
              </div>
              <div className="info-item">
                <label>Payment Date</label>
                <p>
                  {formatDateTime(
                    booking.registrationPaymentDetails.paymentDate
                  )}
                </p>
              </div>
              <div className="info-item">
                <label>Payer Name</label>
                <p>{booking.registrationPaymentDetails.payerName || "N/A"}</p>
              </div>
              <div className="info-item">
                <label>Payer Email</label>
                <p>{booking.registrationPaymentDetails.payerEmail || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Guest Information */}
        <div className="details-section guests-section">
          <h2 className="section-title">
            Guest Details ({booking.guests?.length || 0})
          </h2>
          <div className="guests-list">
            {booking.guests && booking.guests.length > 0 ? (
              booking.guests.map((guest, index) => (
                <div key={guest._id || index} className="guest-card">
                  <div className="guest-header">
                    <h3>Guest {index + 1}</h3>
                    <span className="guest-age">Age: {guest.age}</span>
                  </div>
                  <div className="guest-details">
                    {/* Basic Information */}
                    <div className="guest-subsection">
                      <h4>Basic Information</h4>
                      <div className="guest-info-grid">
                        <div className="guest-info-item">
                          <label>Guest ID</label>
                          <p className="guest-id-field">{guest._id}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Name</label>
                          <p>{guest.name}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Age</label>
                          <p>{guest.age}</p>
                        </div>
                        {guest.gender && (
                          <div className="guest-info-item">
                            <label>Gender</label>
                            <p className="capitalize">{guest.gender}</p>
                          </div>
                        )}
                        {guest.phone && (
                          <div className="guest-info-item">
                            <label>Phone</label>
                            <p>{guest.phone}</p>
                          </div>
                        )}
                        {guest.country && (
                          <div className="guest-info-item">
                            <label>Country</label>
                            <p>{guest.country}</p>
                          </div>
                        )}
                        {guest.state && (
                          <div className="guest-info-item">
                            <label>State</label>
                            <p>{guest.state}</p>
                          </div>
                        )}
                        {guest.address && (
                          <div className="guest-info-item full-width">
                            <label>Address</label>
                            <p>{guest.address}</p>
                          </div>
                        )}
                        <div className="guest-info-item">
                          <label>Created At</label>
                          <p>{formatDateTime(guest.createdAt)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Updated At</label>
                          <p>{formatDateTime(guest.updatedAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Passport Information */}
                    {(guest.passportNumber ||
                      guest.passportCountry ||
                      guest.passportIssuedOn ||
                      guest.passportExpiresOn ||
                      guest.passport) && (
                      <div className="guest-subsection">
                        <h4>Passport Information</h4>
                        <div className="guest-info-grid">
                          {guest.passportNumber && (
                            <div className="guest-info-item">
                              <label>Passport Number</label>
                              <p>{guest.passportNumber}</p>
                            </div>
                          )}
                          {guest.passportCountry && (
                            <div className="guest-info-item">
                              <label>Passport Country</label>
                              <p>{guest.passportCountry}</p>
                            </div>
                          )}
                          {guest.passportIssuedOn && (
                            <div className="guest-info-item">
                              <label>Issued On</label>
                              <p>{formatDate(guest.passportIssuedOn)}</p>
                            </div>
                          )}
                          {guest.passportExpiresOn && (
                            <div className="guest-info-item">
                              <label>Expires On</label>
                              <p>{formatDate(guest.passportExpiresOn)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {(guest.emergencyContactName ||
                      guest.emergencyContactNumber) && (
                      <div className="guest-subsection">
                        <h4>Emergency Contact</h4>
                        <div className="guest-info-grid">
                          {guest.emergencyContactName && (
                            <div className="guest-info-item">
                              <label>Contact Name</label>
                              <p>{guest.emergencyContactName}</p>
                            </div>
                          )}
                          {guest.emergencyContactNumber && (
                            <div className="guest-info-item">
                              <label>Contact Number</label>
                              <p>{guest.emergencyContactNumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {(guest.passport ||
                      guest.medicalCertificate ||
                      guest.travelInsurance) && (
                      <div className="guest-subsection">
                        <h4>Uploaded Documents</h4>
                        <div className="documents-grid">
                          {guest.passport && (
                            <div className="document-item">
                              <label>Passport Copy</label>
                              <a
                                href={guest.passport}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="document-link"
                              >
                                View Document →
                              </a>
                            </div>
                          )}
                          {guest.medicalCertificate && (
                            <div className="document-item">
                              <label>Medical Certificate</label>
                              <a
                                href={guest.medicalCertificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="document-link"
                              >
                                View Document →
                              </a>
                            </div>
                          )}
                          {guest.travelInsurance && (
                            <div className="document-item">
                              <label>Travel Insurance</label>
                              <a
                                href={guest.travelInsurance}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="document-link"
                              >
                                View Document →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-guests">No guest information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
