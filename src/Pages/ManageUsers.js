import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Make sure this path is correct
import view from '../Assets/view-Icon.png';
import view2 from '../Assets/view-Icon2.png';
import view3 from '../Assets/view-Icon3.png';
import del from '../Assets/mi_delete.png';
import archive from '../Assets/Icon.png';
import filter from '../Assets/system-uicons_filtering.png';
import archive2 from '../Assets/archive.png';
import del2 from '../Assets/m_delete.png';
import './ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const usersPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profile').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const idsOnPage = paginatedUsers.map((u) => u.id);
    const allSelected = idsOnPage.every((id) => selectedUsers.includes(id));
    setSelectedUsers((prev) =>
      allSelected
        ? prev.filter((id) => !idsOnPage.includes(id))
        : [...new Set([...prev, ...idsOnPage])]
    );
  };

  const handleResetPassword = (email) => {
    setAlertMessage(`Password reset link sent to ${email} (mocked).`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteUsers = async (ids) => {
    const { error } = await supabase.from('profile').delete().in('id', ids);
    if (error) {
      console.error('Error deleting users:', error);
      setAlertMessage('Failed to delete users.');
    } else {
      setAlertMessage('Users deleted successfully.');
      setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
      setSelectedUsers([]);
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const renderModal = (type, onClose) => (
    <div className="modal">
      <div className="modal-content">
        <h3>{type === 'delete' ? 'Delete' : 'Archive'} selected users?</h3>
        <p>This can't be undone. Are you sure you want to proceed?</p>
        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="delete"
            onClick={() => {
              if (type === 'delete') {
                handleDeleteUsers(selectedUsers);
              } else {
                setAlertMessage('Archive feature not implemented yet.');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
              }
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="manage-users-container">
      {showAlert && <div className="alert-box">{alertMessage}</div>}
      <h1 className="manage-users-header">Manage Users</h1>

      {/* Stats */}
      <div className="stats-container">
        <div className="stats-card">
          <img src={view} alt="view" />
          <h4>Total Users</h4>
          <strong>{users.length}</strong>
        </div>
        <div className="stats-card">
          <img src={view2} alt="view" />
          <h4>Active Users</h4>
          <strong>–</strong>
        </div>
        <div className="stats-card">
          <img src={view3} alt="view" />
          <h4>Inactive Users</h4>
          <strong>–</strong>
        </div>
        <div className="stats-card">
          <img src={archive} alt="view" />
          <h4>Deleted Accounts</h4>
          <strong>–</strong>
        </div>
      </div>

      {/* Filter */}
      <div className="table-actions">
        <button className="filter-btn">
          Filter by <img className="filter-img" src={filter} alt="view" />
        </button>
      </div>

      {/* Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  paginatedUsers.every((u) => selectedUsers.includes(u.id)) &&
                  paginatedUsers.length > 0
                }
              />
            </th>
            <th>Username</th>
            <th>Email Address</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelect(user.id)}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.location || '—'}</td>
              <td>
                <button
                  className="reset-btn"
                  onClick={() => handleResetPassword(user.email)}
                >
                  Reset Password
                </button>
                <span
                  style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => handleDeleteUsers([user.id])}
                >
                  <img src={del} alt="delete icon" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bulk Actions */}
      <div className="actions">
        <button
          className="delete"
          onClick={() => setShowDeleteModal(true)}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
          <img src={del2} alt="delete" />
        </button>
        <button
          className="archive"
          onClick={() => setShowArchiveModal(true)}
          disabled={selectedUsers.length === 0}
        >
          Archive Selected
          <img src={archive2} alt="archive" />
        </button>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      {/* Modals */}
      {showDeleteModal && renderModal('delete', () => setShowDeleteModal(false))}
      {showArchiveModal && renderModal('archive', () => setShowArchiveModal(false))}
    </div>
  );
}

export default ManageUsers;
 