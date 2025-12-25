"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    // AuthProvider will redirect to /login
  };

  // Loading state while restoring session
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
      <p className="text-slate-400 mb-8">
        Track your finances and manage transactions
      </p>

      {/* (Your existing dashboard UI stays exactly the same here) */}
    </div>
  );
}
