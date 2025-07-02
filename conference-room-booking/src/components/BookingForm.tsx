import React, { useState } from 'react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { BookingType } from '../types';
import './BookingForm.css';

interface BookingFormProps {
  onBookingSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
  const { addBooking, getBookingsByTimeRange } = useBookings();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    booker: '',
    presenter: '',
    type: BookingType.MEETING,
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    numberOfPeople: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Validate time
      if (formData.startTime >= formData.endTime) {
        setMessage('End time must be after start time');
        setIsSubmitting(false);
        return;
      }

      // Check for overlapping bookings
      const overlaps = getBookingsByTimeRange(
        formData.date,
        formData.startTime,
        formData.endTime
      );
      if (overlaps.length > 0) {
        setMessage('This slot is already booked');
        setIsSubmitting(false);
        return;
      }

      await addBooking({
        ...formData,
        booker: formData.booker || user?.username || 'Unknown',
        presenter: formData.presenter || formData.booker || user?.username || 'Unknown'
      });

      setMessage('Booking created successfully!');
      if (onBookingSuccess) onBookingSuccess();
      // Reset form
      setFormData({
        booker: '',
        presenter: '',
        type: BookingType.MEETING,
        startTime: '',
        endTime: '',
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        numberOfPeople: 1
      });
    } catch (error) {
      setMessage('Error creating booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Create New Booking</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="booker">Booker:</label>
            <input
              type="text"
              id="booker"
              name="booker"
              value={formData.booker}
              onChange={handleInputChange}
              placeholder="Who is booking?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="presenter">Presenter:</label>
            <input
              type="text"
              id="presenter"
              name="presenter"
              value={formData.presenter}
              onChange={handleInputChange}
              placeholder="Who is presenting?"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type of Booking:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value={BookingType.MEETING}>Meeting</option>
              <option value={BookingType.TEACHING_SESSION}>Teaching Session</option>
              <option value={BookingType.STAND_UP}>Stand-up</option>
              <option value={BookingType.INTERVIEW}>Interview</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="numberOfPeople">Number of People:</label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter booking title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter booking description"
            rows={4}
            required
          />
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm; 