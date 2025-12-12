import React from "react";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminLayout from "../components/Admin/AdminLayout";

const Admin = () => {
  
  return (
    <div >
      <AdminLayout >
              <AdminDashboard />
            </AdminLayout>
      
    </div>
  );
};

export default Admin;