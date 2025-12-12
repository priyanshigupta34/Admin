import React, { useState, useEffect } from "react";
import { Edit, Trash2, Eye, ChevronDown } from "lucide-react";

const sampleUsers = [
  {
    id: 1,
    name: "Shashank",
    email: "shashank@gmail.com",
    number: "9876543210",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya",
    email: "priya@gmail.com",
    number: "9123456780",
    status: "Blocked",
  },
  {
    id: 3,
    name: "Preeti",
    email: "preeti@gmail.com",
    number: "9123478980",
    status: "Blocked",
  }
];

const ManageUser = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Debounce input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedEmail(searchEmail), 300);
    return () => clearTimeout(t);
  }, [searchEmail]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(searchName), 300);
    return () => clearTimeout(t);
  }, [searchName]);

  const filteredUsers = users.filter((u) => {
    return (
      (debouncedEmail === "" || u.email.toLowerCase().includes(debouncedEmail.toLowerCase())) &&
      (debouncedName === "" || u.name.toLowerCase().includes(debouncedName.toLowerCase())) &&
      (statusFilter === "All" || u.status === statusFilter)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users, permissions, and operations.</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Search by Email</label>
          <input
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter email"
          />
        </div>

        {/* Search Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Search by Name</label>
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter name"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-700">Status</label>

          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 flex justify-between items-center hover:bg-blue-50 transition-all duration-200"
          >
            {statusFilter}
            <ChevronDown size={18} className="text-blue-600" />
          </button>

          {statusOpen && (
            <div className="absolute w-full bg-white/95 backdrop-blur-lg border border-blue-100 rounded-lg shadow-xl mt-1 z-10">
              {["All", "Active", "Blocked"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setStatusOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-blue-50 transition-colors duration-200 rounded-md mx-1"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100">
        <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">Users Data</h3>

        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-b">
            <tr>
              <th className="p-3 rounded-tl-lg">S.No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Number</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-tr-lg">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u.id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-200">
                <td className="p-3 text-gray-700">{index + 1}</td>
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3 text-gray-700">{u.email}</td>
                <td className="p-3 text-gray-700">{u.number}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      u.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                {/* ACTION ICONS */}
                <td className="p-3 flex gap-3">
                  <button className="p-1.5 hover:bg-blue-100 rounded-lg transition-all duration-200">
                    <Eye size={18} className="cursor-pointer text-blue-500" />
                  </button>
                  <button className="p-1.5 hover:bg-green-100 rounded-lg transition-all duration-200">
                    <Edit size={18} className="cursor-pointer text-green-600" />
                  </button>
                  <button className="p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200">
                    <Trash2 size={18} className="cursor-pointer text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-400 py-6">No matching users...</p>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm rounded-lg bg-white/80 backdrop-blur-lg border border-blue-200 text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Prev
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 shadow-sm ${
                currentPage === page
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-md"
                  : "bg-white/80 backdrop-blur-lg border border-blue-200 text-gray-700 hover:bg-blue-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm rounded-lg bg-white/80 backdrop-blur-lg border border-blue-200 text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageUser;