"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Ambil data user dari localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length > 0) {
      // Ambil user terakhir yang mendaftar
      const lastUser = users[users.length - 1];
      setUserData(lastUser);
    } else {
      // Jika tidak ada user, redirect ke register
      router.push("/register");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("users");
    router.push("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-900">
              Neuro<span className="text-blue-600">AI</span>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3 text-right">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 mt-20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Menu Utama</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Survey EEG Card - Active */}
            <Link
              href="/survey-eeg"
              className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 opacity-20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                      📊
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900">Survey EEG</h2>
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Tersedia
                      </span>
                    </div>
                  </div>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ikuti penelitian EEG dengan menonton video dan memberikan rating
                </p>
              </div>
            </Link>

            {/* Kuesioner - Coming Soon */}
            <div className="relative p-6 bg-gray-50 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
                  Segera Hadir
                </span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-white text-2xl">
                  📝
                </div>
                <h2 className="text-xl font-bold text-gray-700 ml-4">Kuesioner</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Fitur kuesioner akan segera tersedia untuk Anda
              </p>
            </div>

            {/* Pengaturan - Coming Soon */}
            <div className="relative p-6 bg-gray-50 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
                  Segera Hadir
                </span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-white text-2xl">
                  ⚙️
                </div>
                <h2 className="text-xl font-bold text-gray-700 ml-4">Pengaturan</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Kelola preferensi dan konfigurasi akun Anda
              </p>
            </div>

            {/* Riwayat - Coming Soon */}
            <div className="relative p-6 bg-gray-50 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
                  Segera Hadir
                </span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-white text-2xl">
                  📈
                </div>
                <h2 className="text-xl font-bold text-gray-700 ml-4">Riwayat</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Lihat riwayat aktivitas dan pencapaian Anda
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}