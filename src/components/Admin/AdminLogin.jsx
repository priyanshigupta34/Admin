import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Shield } from "lucide-react";

const FIXED_ADMIN = {
  email: "admin@aayan.com",
  password: "ayan1234",
  name: "Aayan admin",
};

const AdminLogin = ({ onLoginSuccess, navigate } = {}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const routerNavigate = useNavigate();

  const _setCurrentAdmin = (admin) => {
    try {
      localStorage.setItem("admin_current", JSON.stringify(admin));
    } catch {}
  };

  const extractToken = (resData) => {
    if (!resData) return null;
    if (typeof resData === "string") return resData;
    if (resData.token) return resData.token;
    if (resData?.data?.token) return resData.data.token;
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setIsLoading(true);

    const trimmedEmail = (email || "").trim();
    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    // Simulate loading for demo
    await new Promise(resolve => setTimeout(resolve, 800));

    // FIXED ADMIN 
      if (trimmedEmail === FIXED_ADMIN.email && password === FIXED_ADMIN.password) {
      const adminRecord = { name: FIXED_ADMIN.name, email: FIXED_ADMIN.email };
      localStorage.setItem("token", "STATIC_ADMIN_TOKEN");
      _setCurrentAdmin(adminRecord);
      if (typeof onLoginSuccess === "function") onLoginSuccess(adminRecord);
      // prefer a navigate prop if supplied, otherwise use react-router's navigate
      if (typeof navigate === "function") navigate("/admin/dashboard");
      else routerNavigate("/admin/dashboard");
      setIsLoading(false);
      return;
    }

    // SERVER LOGIN FOR NORMAL ADMINS
    try {
      const res = await api.post(
        "https://localhost5000/api/adminlogin",
        { email: trimmedEmail, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = extractToken(res?.data);
      if (token) {
        localStorage.setItem("token", token);
      }

      const adminRecord = {
        name: res?.data?.user?.name || trimmedEmail,
        email: res?.data?.user?.email || trimmedEmail,
      };

      _setCurrentAdmin(adminRecord);
      if (typeof onLoginSuccess === "function") onLoginSuccess(adminRecord);

      // prefer a navigate prop if supplied, otherwise use react-router's navigate
      if (typeof navigate === "function") navigate("/admin/dashboard");
      else routerNavigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed:", err?.response || err);
      setError(err?.response?.data?.msg || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-blue-100 transform transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by advanced security protocols
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact your system administrator
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;