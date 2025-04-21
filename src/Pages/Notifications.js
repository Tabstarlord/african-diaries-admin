import React, { useState } from 'react';
import './Notifications.css';

const totalNotifications = 750;
const perPage = 15;
const totalPages = Math.ceil(totalNotifications / perPage);

const generateNotifications = (page) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: start + index,
    name: 'Jaybougie',
    message: 'replied to your comment',
    time: 'Just Now',
    avatar: `https://randomuser.me/api/portraits/women/${(start + index) % 90}.jpg`,
  }));
};

export default function Notifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const notifications = generateNotifications(currentPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  

  const handleDelete = () => {
    if (selectedIds.length === 0) return alert('Please select notifications to delete.');
    alert(`Deleted ${selectedIds.length} notification(s).`);
    setSelectedIds([]); // Simulate deletion
  };

  const handleMarkRead = () => {
    if (selectedIds.length === 0) return alert('Please select notifications to mark as read.');
    alert(`Marked ${selectedIds.length} notification(s) as read.`);
    setSelectedIds([]);
  };

  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>
      <div className="notification-list">
        {notifications.map((note) => (
          <div className="notification-item" key={note.id}>
            <span className="red-dot" />
            <img src={note.avatar} alt="Avatar" className="avatar" />
            <div className="text-content">
              <p>
                <strong>{note.name}</strong> {note.message}
              </p>
              <span className="timestamp">{note.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="notification-footer">
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>{'<'}</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>{'>'}</button>
        </div>
        <div className="action-buttons">
          <button className="delete-btn" onClick={handleDelete}>
            Delete Notifications 🗑️
          </button>
          <button className="mark-read-btn" onClick={handleMarkRead}>
            Mark as Read 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
