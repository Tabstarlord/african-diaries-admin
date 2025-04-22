
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SIdebar from './Components/Sidebar'
import Dashboard from './Pages/Dashboard'
import ManageUsers from './Pages/ManageUsers'
import ManageVideos from './Pages/ManageVideos'
import Notifications from './Pages/Notifications'
import Settings from './Pages/Settings'
import UploadVideos from './Pages/UploadVideos'
import Login from './Pages/Login';




function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <SIdebar />}
      

      <Routes>
      <Route path='/' element={<Login />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/ManageUsers' element={<ManageUsers />} />
        <Route path='/ManageVideos' element={<ManageVideos />} />
        <Route path='/Notifications' element={<Notifications />} />
        <Route path='/Settings' element={<Settings />} />
        <Route path='/UploadVideos' element={<UploadVideos />} />
      </Routes>
      
    </div>
  );
}

export default App;
