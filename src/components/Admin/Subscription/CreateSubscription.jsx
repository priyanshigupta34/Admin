import React, { useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

const CreateSubscription = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:4001/api/subscription/subscriptions",
        { title, description, planType, price },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Subscription created successfully!");
      setTitle("");
      setDescription("");
      setPlanType("monthly");
      setPrice("");

      onCreated && onCreated(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-lg font-bold text-blue-600 mb-4">
        Create Subscription
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium">Subscription Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
            placeholder="Premium Plan"
            required
          />
        </div>

        {/* Plan Type */}
        <div>
          <label className="text-sm font-medium">Plan Type</label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1 resize-none"
            placeholder="Describe what this plan includes..."
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium">Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
            placeholder="999"
            required
          />
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={18} />
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-3">{success}</p>}
    </div>
  );
};

export default CreateSubscription;
