import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Eye, ChevronDown, Search, Ban, CheckCircle } from "lucide-react";
import CreateSubscription from "./CreateSubscription";
import EditSubscription from "./EditSubscription";

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

 const fetchSubscriptions = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:4001/api/subscription/subscriptions/admin",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  setSubscriptions(res.data);
};
  useEffect(() => {
    fetchSubscriptions(statusFilter);
  }, [statusFilter]);

  const filteredSubscriptions = subscriptions.filter((sub) => {
  const titleMatch = sub.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const statusMatch =
    statusFilter === "All" ||
    (statusFilter === "Active" && sub.isActive === true) ||
    (statusFilter === "Blocked" && sub.isActive === false);

  return titleMatch && statusMatch;
});
 
  const toggleStatus = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(
      `http://localhost:4001/api/subscription/subscriptions/${id}/toggle-status`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSubscriptions((prev) =>
      prev.map((s) =>
        s._id === id ? res.data.subscription : s
      )
    );
  } catch (error) {
    console.error("Failed to update status");
  }
};

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-blue-600">
          Subscription Management
        </h1>
        <p className="text-gray-600">
          Create and manage subscription plans
        </p>
      </div>

      {/* CREATE SUBSCRIPTION */}
      <CreateSubscription onCreated={() => fetchSubscriptions(statusFilter)} />

      {/* TABLE CARD */}
      <div className="bg-white/80 p-6 rounded-xl shadow-lg border border-blue-100">
        {/* TABLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="font-bold text-lg text-blue-600">
            Subscription Plans
          </h3>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                className="pl-8 p-2 border rounded-lg text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="p-2 border rounded-lg flex items-center gap-2"
              >
                {statusFilter}
                <ChevronDown size={16} />
              </button>

              {statusOpen && (
                <div className="absolute right-0 bg-white border rounded-lg shadow mt-1 z-50">
                  {["All", "Active", "Blocked"].map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setStatusOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
       <table className="w-full text-sm border-collapse">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="px-4 py-3 text-center w-16">S.No</th>
      <th className="px-4 py-3 text-left">Title</th>
      <th className="px-4 py-3 text-center w-32">Plan</th>
      <th className="px-4 py-3 text-center w-28">Price</th>
      <th className="px-4 py-3 text-center w-32">Status</th>
      <th className="px-4 py-3 text-center w-32">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredSubscriptions.map((sub, i) => (
      <tr
        key={sub._id}
        className="border-b border-blue-100 hover:bg-blue-50 transition"
      >
        {/* S.No */}
        <td className="px-4 py-3 text-center align-middle">
          {i + 1}
        </td>

        {/* Title */}
        <td className="px-4 py-3 text-left font-medium text-gray-800 align-middle">
          {sub.title}
        </td>

        {/* Plan */}
        <td className="px-4 py-3 text-center capitalize align-middle">
          {sub.planType}
        </td>

        {/* Price */}
        <td className="px-4 py-3 text-center align-middle">
          ₹{sub.price}
        </td>

        {/* Status */}
        <td className="px-4 py-3 text-center align-middle">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
              sub.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {sub.isActive ? "Active" : "Blocked"}
          </span>
        </td>

        {/* Action */}
        <td className="px-4 py-3 text-center align-middle">
          <div className="inline-flex items-center justify-center gap-3">
            {/* Edit */}
            <button
              onClick={() => {
                setSelectedSubscription(sub);
                setEditOpen(true);
              }}
              className="p-1.5 rounded-md hover:bg-green-100 transition"
            >
              <Edit size={18} className="text-green-600" />
            </button>

            {/* Block / Unblock */}
            <button
              onClick={() => toggleStatus(sub._id)}
              className={`p-1.5 rounded-md transition ${
                sub.isActive
                  ? "hover:bg-red-100"
                  : "hover:bg-green-100"
              }`}
              title={sub.isActive ? "Block" : "Unblock"}
            >
              {sub.isActive ? (
                <Ban size={18} className="text-red-600" />
              ) : (
                <CheckCircle size={18} className="text-green-600" />
              )}
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <EditSubscription
        open={editOpen}
        onClose={() => setEditOpen(false)}
        subscription={selectedSubscription}
        onUpdated={(updated) =>
          setSubscriptions((prev) =>
            prev.map((s) => (s._id === updated._id ? updated : s))
          )
        }
      />
    </div>
  );
};

export default SubscriptionList;
