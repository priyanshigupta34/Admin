import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";




const EditSubscription = ({ open, onClose, subscription, onUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (subscription) {
      setTitle(subscription.title || "");
      setDescription(subscription.description || "");
      setPlanType(subscription.planType || "monthly");
      setPrice(subscription.price || "");
    }
  }, [subscription]);

  if (!open) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:4001/api/subscription/subscriptions/${subscription._id}`,
        { title, description, planType, price },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated(res.data.subscription);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update subscription");
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
            Edit Subscription
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Subscription Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Plan Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Plan Type
            </label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg mt-1"
              required
            />
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

export default EditSubscription;
