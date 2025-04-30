import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path as needed
import del from '../Assets/m_delete.png'
import archive from '../Assets/archive.png'
import './Notifications.css';

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkReadModal, setShowMarkReadModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const perPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const totalPages = Math.ceil(notifications.length / perPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, message, created_at, read, actor_id, profiles:actor_id(username, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Fetch error:', error);
      else setNotifications(data);
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('realtime:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Alert helper
  const showAlertMsg = (msg) => {
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', selectedIds);

    if (!error) {
      setSelectedIds([]);
      showAlertMsg('Notifications deleted successfully');
    }
    setShowDeleteModal(false);
  };

  const handleMarkRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', selectedIds);

    if (!error) {
      setSelectedIds([]);
      showAlertMsg('Marked as read');
    }
    setShowMarkReadModal(false);
  };

  const handleArchive = async () => {
    // If you had `archived` column, update here
    showAlertMsg('Archive not yet implemented (no column)');
    setShowArchiveModal(false);
  };

  const renderModal = (type, onConfirm, onClose) => (
    <div className="modal">
      <div className="modal-content">
        <h3>{type} Notifications</h3>
        <p>This action cannot be undone. Are you sure?</p>
        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="delete" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>

      {showAlert && <div className="alert-box">{alertMessage}</div>}

      <div className="notification-list">
        {paginatedNotifications.map((note) => (
          <div
            className={`notification-item ${selectedIds.includes(note.id) ? 'selected' : ''}`}
            key={note.id}
            onClick={() =>
              setSelectedIds((prev) =>
                prev.includes(note.id) ? prev.filter((id) => id !== note.id) : [...prev, note.id]
              )
            }
          >
            {!note.read && <span className="red-dot" />}
            <img
              src={note.profiles?.avatar_url || 'https://via.placeholder.com/40'}
              alt="Avatar"
              className="avatar"
            />
            <div className="text-content">
              <p>
                <strong>{note.profiles?.username || 'Unknown'}</strong> {note.message}
              </p>
              <span className="timestamp">
                {new Date(note.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="notification-footer">
        <div className="pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            {'<'}
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            {'>'}
          </button>
        </div>
        <div className="action-buttons">
          <button className='delete-btn' onClick={() => setShowDeleteModal(true)} disabled={selectedIds.length === 0}>
            Delete Notifications <img src={del} alt='delete' />
          </button>
          <button className='mark-read-btn' onClick={() => setShowMarkReadModal(true)} disabled={selectedIds.length === 0}>
            Mark as Read <img src={archive} alt='mark as read' />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal &&
        renderModal('Delete', handleDelete, () => setShowDeleteModal(false))}
      {showMarkReadModal &&
        renderModal('Mark as Read', handleMarkRead, () => setShowMarkReadModal(false))}
      {showArchiveModal &&
        renderModal('Archive', handleArchive, () => setShowArchiveModal(false))}
    </div>
  );
}
