import React, { useState } from 'react';
import view from '../Assets/view-Icon.png'
import view2 from '../Assets/view-Icon2.png'
import view3 from '../Assets/view-Icon3.png'
import del from '../Assets/mi_delete.png'
import archive from '../Assets/Icon.png'
import filter from '../Assets/system-uicons_filtering.png'
import './ManageUsers.css'
import archive2 from '../Assets/archive.png'
import del2 from '../Assets/m_delete.png'



function ManageUsers() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [alertMessage, setAlertMessage] = useState('');
const [showAlert, setShowAlert] = useState(false);


  // Dummy user data
  const users = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@email.com`,
    location: `City ${i % 10}`,
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }));

  const usersPerPage = 20;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleResetPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    setAlertMessage(`Password reset link sent to ${user.email}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  const handleDeleteSingleUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setAlertMessage(`User ${user.name} deleted successfully.`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  
    // Optional: actually remove user from the array if you implement that later
  };
  

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

  const renderModal = (type, onClose) => (
    <div className="modal">
      <div className="modal-content">
        <h3>{type === 'delete' ? 'Delete' : 'Archive'} selected users?</h3>
        <p> This can't be undone. Are you sure you want to proceed?</p>
        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button
            className="delete"
            onClick={() => {
              // Remove selected users (fake action)
              setSelectedUsers([]);
              setAlertMessage(`Users ${type === 'delete' ? 'deleted' : 'archived'} successfully.`);
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 3000);
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
    
    {showAlert && (
  <div className="alert-box">
    {alertMessage}
  </div>
)}

<h1 className="manage-users-header">Manage Users</h1>

      {/* Stats */}
      <div className="stats-container">
        <div className="stats-card">
          <img src={view} alt='view' />
          <h4>Total Users</h4>
          <strong>350.6k</strong>
        </div>
        <div className="stats-card">
        <img src={view2} alt='view' />
          <h4>Active Users</h4>
          <strong>200k</strong>
        </div>
        <div className="stats-card">
        <img src={view3} alt='view' />
          <h4>Inactive Users</h4>
          <strong>150.6k</strong>
        </div>
        <div className="stats-card">
        <img src={archive} alt='view' />
          <h4>Deleted Accounts</h4>
          <strong>12k</strong>
        </div>
      </div>

      {/* Filter */}
      <div className="table-actions">
        <button className="filter-btn">Filter by <img className='filter-img' src={filter} alt='view' /></button>
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
            <th>Profile</th>
            <th>Email Address</th>
            <th>Location</th>
            <th>Status</th>
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
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.location}</td>
              <td>{user.status}</td>
              <td>
                <button className="reset-btn"  onClick={() => handleResetPassword(user.id)}>Reset Password</button>
                <span
                  style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}  onClick={() => handleDeleteSingleUser(user.id)}
                >
                  <img src={del} alt='delete icon' />
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
          <img src={del2} alt='delete' />
        </button>
        <button
          className="archive"
          onClick={() => setShowArchiveModal(true)}
          disabled={selectedUsers.length === 0}
        >
          Archive Selected
          <img src={archive2} alt='archive' />
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
