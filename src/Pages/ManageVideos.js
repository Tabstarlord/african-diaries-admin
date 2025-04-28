import React, { useState } from 'react';
import './ManageVideos.css';
import view from '../Assets/view-Icon.png';
import view2 from '../Assets/view-Icon2.png';
import view3 from '../Assets/view-Icon3.png';
import active from '../Assets/Icon.png';
import del2 from '../Assets/m_delete.png'
import del from '../Assets/mi_delete.png'
import edit from '../Assets/edit-2.png'
import archive from '../Assets/archive.png'
import publish from '../Assets/Vector.png'

const initialVideos = [
  { id: 1, title: 'Video A', category: 'Trans', views: '124k', likes: '124k', uploadDate: 'Today' },
  { id: 2, title: 'Video B', category: 'Gay', views: '454k', likes: '454k', uploadDate: 'Today' },
  { id: 3, title: 'Video C', category: 'Straight', views: '354k', likes: '354k', uploadDate: 'Today' },
  { id: 4, title: 'Video D', category: 'Trans', views: '234k', likes: '234k', uploadDate: 'Today' },
  { id: 5, title: 'Video E', category: 'Straight', views: '561k', likes: '561k', uploadDate: 'Today' },
  { id: 6, title: 'Video F', category: 'Gay', views: '754k', likes: '754k', uploadDate: 'Today' }
];

const ManageVideos = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [videoToEdit, setVideoToEdit] = useState(null);

  const itemsPerPage = 10;

  const parseCount = (str) => {
    const num = parseFloat(str);
    return str.toLowerCase().includes('k') ? num * 1000 :
           str.toLowerCase().includes('m') ? num * 1000000 : num;
  };

  const formatCount = (num) => num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' :
                          num >= 1e3 ? (num / 1e3).toFixed(0) + 'k' : num.toString();

  const filteredVideos = videos.filter(video =>
    filterCategory === 'All' || video.category === filterCategory
  );

  const paginatedVideos = filteredVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filteredVideos.map(v => v.id) : []);
  };

  const handleArchivedDelete = (id) => {
    setArchivedVideos(prev => prev.filter(v => v.id !== id));
    showAlert("Video Deleted Successfully");
  };
  
  const confirmDelete = () => {
    const updated = videos.filter(v => v.id !== videoToDelete);
    setVideos(updated);
    showAlert(`Deleted Successfully`);
    setShowModal(false);
    setVideoToDelete(null);
  };

  const confirmArchive = () => {
    setVideos(prev =>
      prev.map(video =>
        videosToArchive.includes(video.id) ? { ...video, archived: true } : video
      )
    );
    showAlert(`Archived Successfully`);
    setVideosToArchive([]);
    setSelectedIds([]);
    setShowArchiveModal(false);
  };
  

  

  const [archivedVideos, setArchivedVideos] = useState([]);
const [selectedArchived, setSelectedArchived] = useState([]);
const [showArchivedModal, setShowArchivedModal] = useState(false);


 
  
  const handleBulkDelete = () => {
    const toDelete = selectedArchived.length;
    setArchivedVideos(prev => prev.filter(v => !selectedArchived.includes(v.id)));
    setSelectedArchived([]);
    showAlert(`${toDelete} Video${toDelete > 1 ? 's' : ''} Deleted Successfully`);
  };
  
  

  const getTotal = (field) =>
    videos.reduce((sum, v) => sum + parseCount(v[field]), 0);

  const [showArchiveModal, setShowArchiveModal] = useState(false);
const [videosToArchive, setVideosToArchive] = useState([]);

const [alert, setAlert] = useState({ message: '', visible: false });

const showAlert = (msg) => {
  setAlert({ message: msg, visible: true });
  setTimeout(() => {
    setAlert({ message: '', visible: false });
  }, 3000); // disappears after 3s
};

const toggleArchivedSelection = (id) => {
  setSelectedArchived(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );
};

const handleSelectAllArchived = (e) => {
  if (e.target.checked) {
    setSelectedArchived(archivedVideos.map(video => video.id));
  } else {
    setSelectedArchived([]);
  }
};

const handlePublish = (id) => {
  setArchivedVideos(prev => prev.filter(v => v.id !== id));
  setVideos(prev => [...prev, { ...archivedVideos.find(v => v.id === id), archived: false }]);
  showAlert("Video Published Successfully");
};

const handleBulkPublish = () => {
  const toPublish = archivedVideos.filter(v => selectedArchived.includes(v.id));
  setArchivedVideos(prev => prev.filter(v => !selectedArchived.includes(v.id)));
  setVideos(prev => [...prev, ...toPublish.map(v => ({ ...v, archived: false }))]);
  showAlert(`${toPublish.length} Video${toPublish.length > 1 ? 's' : ''} Published Successfully`);
  setSelectedArchived([]);
};

const handleEdit = (video) => {
  setVideoToEdit(video);
  setShowEditModal(true);
};

const confirmEdit = () => {
  setVideos(prev =>
    prev.map(v => (v.id === videoToEdit.id ? videoToEdit : v))
  );
  setShowEditModal(false);
  showAlert('Video Updated Successfully');
};









  return (
    <div className="manage-videos">
      {alert.visible && (
  <div className="toast-alert">
    {alert.message}
    <button onClick={() => setAlert({ ...alert, visible: false })}>✖</button>
  </div>
)}

      <h1 className="manage-videos-header">Manage Videos</h1>

      <div className="manage-videos-container">
        <div className="manage-videos-card">
          <img src={view} alt="Total Videos" />
          <span className="manage-videos-label">Total Videos:</span>
          <span className="manage-videos-value">{videos.length}</span>
        </div>

        <div className="manage-videos-card">
          <img src={view2} alt="Total Viewers" />
          <span className="manage-videos-label">Total Viewers:</span>
          <span className="manage-videos-value">{formatCount(getTotal('views'))}</span>
        </div>

        <div className="manage-videos-card">
          <img src={view3} alt="Total Likes" />
          <span className="manage-videos-label">Total Likes:</span>
          <span className="manage-videos-value">{formatCount(getTotal('likes'))}</span>
        </div>

        <div className="manage-videos-card">
          <img src={active} alt="Archived Videos" />
          <span className="manage-videos-label">Archived Videos:</span>
          <span className="manage-videos-value">{videos.filter(v => v.archived).length}</span>
        </div>

        <select className="filter-dropdown" onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
          <option value="All">All Categories</option>
          <option value="Trans">Trans</option>
          <option value="Gay">Gay</option>
          <option value="Straight">Straight</option>
        </select>
      </div>

      <button className='managevideos-view-archive' onClick={() => setShowArchivedModal(true)}>
  View Archived
      </button>


      <table className="videos-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.length === filteredVideos.length && filteredVideos.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Title</th>
            <th>Category</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Upload Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedVideos.length > 0 ? (
            paginatedVideos.map(video => (
              <tr key={video.id} className={video.archived ? 'archived' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(video.id)}
                    onChange={() => handleCheckboxChange(video.id)}
                  />
                </td>
                <td>{video.title}</td>
                <td>{video.category}</td>
                <td>{video.views}</td>
                <td>{video.likes}</td>
                <td>{video.uploadDate}</td>
                <td>
                <button onClick={() => handleEdit(video)} title="Edit">
                  <img src={edit} alt='edit' />
                </button>

                  <button onClick={() => {
                  setVideosToArchive([video.id]);
                  setShowArchiveModal(true);
                  }} title="Archive">
                    <img src={archive} alt='archive' />
                  </button>

                  <button onClick={() => {
                  setVideoToDelete(video.id);
                  setShowModal(true);
                  }} title="Delete">
                    <img src={del} alt='delete' />
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No videos found for this filter.</td></tr>
          )}
        </tbody>
      </table>

      <footer>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>&lt;</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>&gt;</button>
        </div>
        <div className="bulk-actions">
        <button
        className="delete-btn"
        onClick={() => {
        if (selectedIds.length > 0) {
        setVideoToDelete(selectedIds);
        setShowModal(true); // or create a bulk delete modal if you want
        }}}>Delete Selected 
        <img src={del2} alt='delete' />
        </button>

          <button className="archive-btn" onClick={() => {
        if (selectedIds.length > 0) {
        setVideosToArchive(selectedIds);
        setShowArchiveModal(true); // or create a bulk delete modal if you want
        }}}>Archive Selected 
        <img src={archive} alt='archive' />
        </button>

        </div>
      </footer>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Are you sure you want to delete this video?</h3>
            <p>Deleting this video can't be undone. Are you sure you want to proceed?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)} className="cancel">Cancel</button>
              <button onClick={confirmDelete} className="delete">Delete</button>
            </div>
          </div>
        </div>
      )}

{showArchiveModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Archive Confirmation</h3>
      <p>Are you sure you want to archive {videosToArchive.length} video(s)?</p>
      <div className="modal-buttons">
        <button onClick={() => setShowArchiveModal(false)} className="cancel">Cancel</button>
        <button onClick={confirmArchive} className="archive">Archive</button>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Edit Video</h3>
      <div className="modal-body">
        <label>Title:</label>
        <input
          type="text"
          value={videoToEdit.title}
          onChange={(e) =>
            setVideoToEdit({ ...videoToEdit, title: e.target.value })
          }
        />

        <label>Category:</label>
        <select
          value={videoToEdit.category}
          onChange={(e) =>
            setVideoToEdit({ ...videoToEdit, category: e.target.value })
          }
        >
          <option value="Trans">Trans</option>
          <option value="Gay">Gay</option>
          <option value="Straight">Straight</option>
        </select>

        {/* Add more fields if you want to edit views, likes, etc */}
      </div>

      <div className="modal-buttons">
        <button onClick={() => setShowEditModal(false)} className="cancel">Cancel</button>
        <button onClick={confirmEdit} className="save">Save Changes</button>
      </div>
    </div>
  </div>
)}


{showArchivedModal && (
  <div className="modal-overlay">
    <div className="modal-content archived">
      <div className="modal-header">
        <h2>Archived Videos</h2>
        <button onClick={() => setShowArchivedModal(false)}>✖</button>
      </div>

      <table className="archived-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAllArchived} /></th>
            <th>Title</th>
            <th>Category</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Upload Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {archivedVideos.map((video, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedArchived.includes(video.id)}
                  onChange={() => toggleArchivedSelection(video.id)}
                />
              </td>
              <td>{video.title}</td>
              <td>{video.category}</td>
              <td>{video.views}</td>
              <td>{video.likes}</td>
              <td>{video.uploadDate}</td>
              <td>
                <button onClick={() => handlePublish(video.id)}></button>
                <button onClick={() => handleArchivedDelete(video.id)}></button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal-footer">
        <button className="danger" onClick={handleBulkDelete}>Delete Selected <img src={del2} alt='publish' /></button>
        <button className="publish" onClick={handleBulkPublish}>Publish Selected <img src={publish} alt='publish' /></button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ManageVideos;
