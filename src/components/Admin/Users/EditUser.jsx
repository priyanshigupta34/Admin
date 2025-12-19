import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";

const EditUser = ({ open, onClose, user, onUpdated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(0);
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setStatus(user.user_status ?? user.status ?? 0);
      setRole(user.role || "");
    }
  }, [user]);

  if (!open) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:4001/api/user/users/${user.id || user._id}`,
        {
          name,
          email,
          status,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated(res.data.user);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-blue-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold text-blue-600">
            Edit User
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="p-5 space-y-4">
          
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1"
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1"
            >
              <option value={0}>Unverified</option>
              <option value={1}>Active</option>
              <option value={2}>Blocked</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
