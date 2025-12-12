import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, hint }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{value}</div>
      {hint && <div className="text-xs text-blue-500 font-medium mt-2">{hint}</div>}
    </div>
  );
}

export default function AdminDashboard() {
    const navigate = useNavigate();

     return (
         <div className="space-y-6">
           <div >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back — manage users, data and operations....</p>
      </div>
      
     {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="56" hint="+5%" />
        <StatCard title="Total Active" value="50" hint="6 WFH" />
      
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">[will add later]</div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">Top Categories</h3>
          <div className="h-64 flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">[will add later]</div>
        </div>
         </div>
         </div>
     );

}