import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Admin from './pages/Admin.jsx';
import AdminLogin from './components/Admin/AdminLogin.jsx';
import User from './pages/User.jsx';
import CreateSubscription from './components/Admin/Subscription/CreateSubscription.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import Subscrition from './pages/Subscription.jsx';
function App() {
 
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
      <Route path="/" element={<AdminLogin />} />
       <Route path="/admin/dashboard" element={<Admin/>}/>
       <Route path="/admin/users/manage" element={<User/>} />
       {/* <Route
       path="/admin/subscription/create-subscription"
       element={
        <AdminLayout>
          <CreateSubscription/>
        </AdminLayout>
       }
       
       /> */}
       <Route path="/admin/subscription/manage-subscription" element={<Subscrition/>}/>
             </Routes>
    </Router>
  )
};

export default App
