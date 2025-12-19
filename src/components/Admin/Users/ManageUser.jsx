import React, { useState, useEffect } from "react";
import { Edit, Eye, ChevronDown, CheckCircle, Ban } from "lucide-react";
import axios from "axios";
import EditUser from "./EditUser";


 const itemsPerPage = 10;

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:4001/api/user/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.users || [];

        const formatted = data.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          number: u.number,
          user_status: u.user_status,
        }));

        setUsers(formatted);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([]); // prevent crash
      }
    };

    fetchUsers();
  }, []);

  const updateStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 2 : 1;

      await axios.put(
        `http://localhost:4001/api/user/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, user_status: newStatus } : u
        )
      );
    } catch (error) {
      console.error(
        "Failed to update status",
        error.response?.data || error.message
      );
    }
  };
  const STATUS_LABEL = {
    1: "Active",
    2: "Blocked",
    0: "Unverified",
  };

  const STATUS_MAP = {
    Active: 1,
    Blocked: 2,
    Unverified: 0,
  };

  const getUserById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4001/api/user/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setViewUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedEmail(searchEmail), 300);
    return () => clearTimeout(t);
  }, [searchEmail]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(searchName), 300);
    return () => clearTimeout(t);
  }, [searchName]);

  const filteredUsers = users.filter((u) => {
    const emailMatch =
      debouncedEmail === "" ||
      u.email?.toLowerCase().includes(debouncedEmail.toLowerCase());

    const nameMatch =
      debouncedName === "" ||
      u.name?.toLowerCase().includes(debouncedName.toLowerCase());

    const statusMatch =
      statusFilter === "All" || u.user_status === STATUS_MAP[statusFilter];

    return emailMatch && nameMatch && statusMatch;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
const totalPages = Math.max(
  1,
  Math.ceil(filteredUsers.length / itemsPerPage)
);

  

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage users, permissions, and operations.
        </p>
      </div>

      {/* Search Filters */}
      <div className="relative z-20 overflow-visible bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Search by Email
          </label>
          <input
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter email"
          />
        </div>

        {/* Search Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Search by Name
          </label>
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter name"
          />
        </div>

        {/* Status Filter */}
        <div className="relative z-50">
          <label className="text-sm font-medium text-gray-700">Status</label>

          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full p-2 border border-blue-200 rounded-lg mt-1 flex justify-between items-center hover:bg-blue-50 transition-all duration-200"
          >
            {statusFilter}
            <ChevronDown size={18} className="text-blue-600" />
          </button>

          {statusOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-blue-100 rounded-lg shadow-2xl mt-1 z-[9999]">
              {["All", "Active", "Blocked", "Unverified"].map((s) => (
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
      <div className="relative z-10 bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100">
        <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Users Data
        </h3>

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
  {paginatedUsers.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center py-6 text-gray-400">
        No users on this page
      </td>
    </tr>
  ) : (
    paginatedUsers.map((u, index) => (
      <tr
        key={u.id}
        className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-200"
      >
        <td className="p-3 text-gray-700">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="p-3 font-medium text-gray-800">{u.name}</td>
        <td className="p-3 text-gray-700">{u.email}</td>
        <td className="p-3 text-gray-700">{u.number}</td>

        <td className="px-4 py-3 text-center align-middle">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full min-w-[90px] ${
              u.user_status === 1
                ? "bg-green-100 text-green-700"
                : u.user_status === 2
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {STATUS_LABEL[u.user_status]}
          </span>
        </td>

        <td className="p-3 flex gap-3 items-center justify-center">
          <button
            title="View User"
            onClick={() => getUserById(u.id)}
            className={`p-1.5 rounded-lg transition ${
              u.user_status === 0
                ? "hover:bg-yellow-100"
                : "hover:bg-blue-100"
            }`}
          >
            <Eye
              size={18}
              className={
                u.user_status === 0
                  ? "text-yellow-500"
                  : "text-blue-500"
              }
            />
          </button>

          <button
            title="Edit User"
            onClick={() => {
              setEditUser(u);
              setEditOpen(true);
            }}
            className={`p-1.5 rounded-lg transition ${
              u.user_status === 0
                ? "hover:bg-yellow-100"
                : "hover:bg-green-100"
            }`}
          >
            <Edit
              size={18}
              className={
                u.user_status === 0
                  ? "text-yellow-500"
                  : "text-green-600"
              }
            />
          </button>

          {u.user_status === 1 && (
            <button
              title="Block User"
              onClick={() => updateStatus(u.id, u.user_status)}
              className="p-1.5 hover:bg-red-100 rounded-lg transition"
            >
              <Ban size={18} className="text-red-500" />
            </button>
          )}

          {u.user_status === 2 && (
            <button
              title="Unblock User"
              onClick={() => updateStatus(u.id, u.user_status)}
              className="p-1.5 hover:bg-green-100 rounded-lg transition"
            >
              <CheckCircle size={18} className="text-green-500" />
            </button>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>

</table>
        
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
           {totalPages > 0 && (
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
           )}

        <button
          onClick={() =>
            setCurrentPage(
              currentPage < totalPages ? currentPage + 1 : totalPages
            )
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm rounded-lg bg-white/80 backdrop-blur-lg border border-blue-200 text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Next
        </button>
      </div>

      {viewUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">User Details</h2>

            <p>
              <b>Name:</b> {viewUser.name}
            </p>
            <p>
              <b>Email:</b> {viewUser.email}
            </p>
            <p>
              <b>Status:</b> {STATUS_LABEL[viewUser.status]}
            </p>

            <button
              onClick={() => setViewUser(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <EditUser
        open={editOpen}
        user={editUser}
        onClose={() => setEditOpen(false)}
        onUpdated={(updatedUser) => {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === updatedUser._id
                ? {
                    ...u,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    user_status: updatedUser.user_status ?? updatedUser.status,
                    role: updatedUser.role,
                  }
                : u
            )
          );
        }}
      />
    </div>
  );
};

export default ManageUser;
