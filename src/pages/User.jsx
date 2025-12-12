import React from "react";
import ManageUser from "../components/Admin/Users/ManageUser";
import AdminLayout from "../components/Admin/AdminLayout";

const User = () => {
  
  return (
    <div >
      <AdminLayout >
             <ManageUser/>
            </AdminLayout>
      
    </div>
  );
};

export default User;