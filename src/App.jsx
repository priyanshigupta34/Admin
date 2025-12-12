import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Admin from './pages/Admin.jsx';
import AdminLogin from './components/Admin/AdminLogin.jsx';
import User from './pages/User.jsx';

function App() {
 
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
      <Route path="/" element={<AdminLogin />} />
       <Route path="/admin/dashboard" element={<Admin/>}/>
       <Route path="/admin/users" element={<User/>} />
             </Routes>
    </Router>
  )
};

export default App
