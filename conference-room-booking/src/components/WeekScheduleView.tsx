import React, { useState } from 'react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import './ScheduleView.css';

const HOURS = Array.from({ length: 23 }, (_, i) => i + 1); // 1 to 23
const HOUR_HEIGHT = 60; // px, height of one hour row
const DAYS = 7; // Monday to Sunday

const WeekScheduleView: React.FC = () => {
  const { bookings, removeBooking, editBooking } = useBookings();
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const selected = new Date(selectedDate);
  const weekStart = startOfWeek(selected, { weekStartsOn: 1 }); // Monday
  const weekDates = Array.from({ length: DAYS }, (_, i) => addDays(weekStart, i));
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // Helper to get bookings for a specific date
  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = booking.date.length > 10 ? booking.date.split('T')[0] : booking.date;
      return isSameDay(parseISO(bookingDate), date);
    });
  };

  const getBookingPosition = (booking: any) => {
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    const start = (startHour + startMin / 60) - 1; // 1 AM is 0
    const end = (endHour + endMin / 60) - 1;
    const top = start * HOUR_HEIGHT;
    const height = Math.max((end - start) * HOUR_HEIGHT, 24);
    return { top, height };
  };

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return '#e74c3c'; // red
      case 'teaching_session':
        return '#27ae60'; // green
      case 'stand_up':
        return '#2980ef'; // blue
      case 'interview':
        return '#04836c'; // teal
      default:
        return '#e74c3c';
    }
  };

  const getBookingStyle = (booking: any, hour: number) => {
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;
    const bookingStart = startHour * 60 + startMin;
    const bookingEnd = endHour * 60 + endMin;
    // Calculate overlap in minutes
    const overlapStart = Math.max(slotStart, bookingStart);
    const overlapEnd = Math.min(slotEnd, bookingEnd);
    const overlapMinutes = Math.max(0, overlapEnd - overlapStart);
    const percent = (overlapMinutes / 60) * 100;
    const offset = ((overlapStart - slotStart) / 60) * 100;
    return {
      height: `${percent}%`,
      top: `${offset}%`,
      position: 'absolute' as 'absolute',
      left: '2px',
      right: '2px',
    };
  };

  const handleEditClick = (booking: any) => {
    setEditingBooking(booking);
    setEditForm({ ...booking });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (editingBooking) {
      editBooking(editingBooking.id, editForm);
      setEditingBooking(null);
    }
  };

  const handleEditCancel = () => {
    setEditingBooking(null);
  };

  return (
    <div className="week-schedule-container">
      <div className="week-grid-toolbar-row">
        <div style={{ flex: 1 }}></div>
        <div className="week-grid-date-picker-col">
          <label htmlFor="week-date-picker">Select Week: </label>
          <input
            id="week-date-picker"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      <div className="week-grid-header-row">
        <div className="week-grid-time-col"></div>
        {weekDates.map(date => (
          <div key={date.toISOString()} className="week-grid-day-header">
            <div>{format(date, 'EEE')}</div>
            <div>{format(date, 'dd/MM')}</div>
          </div>
        ))}
      </div>
      <div className="week-grid-main-row">
        {/* Time labels */}
        <div className="week-grid-time-col">
          {HOURS.map(hour => (
            <div
              key={hour}
              className="week-grid-time-label"
              style={{ height: HOUR_HEIGHT }}
            >
              {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
            </div>
          ))}
        </div>
        {/* Day columns */}
        {weekDates.map(date => (
          <div key={date.toISOString()} className="week-grid-day-col">
            {/* Hour lines */}
            {HOURS.map((_, i) => (
              <div key={i} className="week-grid-hour-line" style={{ top: i * HOUR_HEIGHT }} />
            ))}
            {/* Bookings */}
            {getBookingsForDay(date).map(booking => {
              const { top, height } = getBookingPosition(booking);
              return (
                <div
                  key={booking.id}
                  className="booking-item week-grid-booking"
                  style={{
                    backgroundColor: getBookingTypeColor(booking.type),
                    top,
                    height,
                  }}
                  onClick={() => handleEditClick(booking)}
                  tabIndex={0}
                  role="button"
                >
                  <div className="booking-content">
                    <div className="booking-title">{booking.title}</div>
                    <div className="booking-details">
                      <span>{booking.presenter}</span>
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="booking-type">
                      {booking.type.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {editingBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Booking</h3>
            <div className="modal-divider" />
            <div className="modal-columns-row">
              <div className="modal-col">
                <div className="modal-row"><label>Title</label><input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Title" /></div>
                <div className="modal-row"><label>Booker</label><input name="booker" value={editForm.booker} onChange={handleEditChange} placeholder="Booker" /></div>
                <div className="modal-row"><label>Presenter</label><input name="presenter" value={editForm.presenter} onChange={handleEditChange} placeholder="Presenter" /></div>
                <div className="modal-row"><label>Start Time</label><input name="startTime" value={editForm.startTime} onChange={handleEditChange} type="time" /></div>
              </div>
              <div className="modal-col">
                <div className="modal-row"><label>End Time</label><input name="endTime" value={editForm.endTime} onChange={handleEditChange} type="time" /></div>
                <div className="modal-row"><label>Type</label><select name="type" value={editForm.type} onChange={handleEditChange}>
                  <option value="meeting">Meeting</option>
                  <option value="teaching_session">Teaching Session</option>
                  <option value="stand_up">Stand-up</option>
                  <option value="interview">Interview</option>
                </select></div>
                <div className="modal-row"><label>Number of People</label><input name="numberOfPeople" value={editForm.numberOfPeople} onChange={handleEditChange} type="number" min="1" max="50" /></div>
                <div className="modal-row"><label>Description</label><textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleEditSave}>Save</button>
              <button onClick={handleEditCancel}>Cancel</button>
              <button onClick={() => { removeBooking(editingBooking.id); setEditingBooking(null); }} style={{ background: '#e74c3c', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekScheduleView; 