"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// GANTI dengan URL Web App dari Google Apps Script Anda
// Pastikan: Execute as: Me, Who has access: Anyone
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBXoUAEmp8D5VvNlr2dClxDWCmbwsTVrblsK_oonNce9pAUhMC0xHciqULbWaOSKDh/exec";

// Data video
const videos = [
  {
    id: 1,
    title: "Struktur Data Queue - 1",
    description: "bebas enjoy",
    thumbnail: "neuro-ai\public\next.svg",
    url: "https://www.youtube.com/watch?v=h7J2FH5ygFs",
    duration: "-"
  },
  {
    id: 2,
    title: "Struktur Data Queue - 2",
    description: "bebas enjoy",
    thumbnail: "neuro-ai\public\next.svg",
    url: "https://www.youtube.com/watch?v=hmU27gedJv4",
    duration: "-"
  },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserForm, setShowUserForm] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    age: "",
    occupation: ""
  });
  const [videoFeedback, setVideoFeedback] = useState<{[key: number]: string}>({});

  // Fungsi untuk mengirim data ke Google Sheets
  const sendToGoogleSheets = async (data: any) => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      console.log('Data berhasil dikirim ke Google Sheets');
      return true;
    } catch (error) {
      console.error('Error mengirim data:', error);
      return false;
    }
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email) {
      // Kirim data user ke Google Sheets
      await sendToGoogleSheets({
        name: userInfo.name,
        email: userInfo.email,
        age: userInfo.age,
        occupation: userInfo.occupation,
        videoId: '',
        videoTitle: 'User Registration',
        feedback: ''
      });
      
      setShowUserForm(false);
    }
  };

  const handleVideoEnd = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (rating: string) => {
    setVideoFeedback({ ...videoFeedback, [selectedVideo.id]: rating });
    
    // Kirim feedback ke Google Sheets
    await sendToGoogleSheets({
      name: userInfo.name,
      email: userInfo.email,
      age: userInfo.age,
      occupation: userInfo.occupation,
      videoId: selectedVideo.id,
      videoTitle: selectedVideo.title,
      feedback: rating
    });
    
    setShowFeedbackModal(false);
  };

  // Helper: convert various YouTube URLs to an embeddable iframe URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    // Try extracting the 11-char video id from common YouTube URL formats
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/);
    const id = match ? match[1] : "";
    if (id) {
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    // fallback to the original url
    return url;
  };

  // YouTube player ref and setup to detect video end
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // create unique player div id for this selected video
    const playerDivId = `youtube-player-${selectedVideo.id}`;

    // extract video id using same logic as embed helper
    const match = selectedVideo.url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match ? match[1] : "";

    if (!videoId) {
      // nothing to do if no video id
      return;
    }

    const createPlayer = () => {
      // destroy any existing player
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }

      if (!(window as any).YT) return;

      playerRef.current = new (window as any).YT.Player(playerDivId, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (e: any) => {
            // YT.PlayerState.ENDED === 0
            if (e.data === (window as any).YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          },
        },
      });
    };

    // Load YouTube IFrame API if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      // onYouTubeIframeAPIReady will be called by the API
      (window as any).onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [selectedVideo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-sans">
      {/* User Information Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang! 👋</h2>
              <p className="text-slate-300">Silakan isi informasi Anda terlebih dahulu</p>
            </div>
            
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Usia
                </label>
                <input
                  type="number"
                  value={userInfo.age}
                  onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan usia"
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={userInfo.occupation}
                  onChange={(e) => setUserInfo({ ...userInfo, occupation: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan pekerjaan"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-6"
              >
                Mulai Menonton
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Video Selesai!</h2>
              <p className="text-slate-300">Bagaimana pendapat Anda tentang video ini?</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleFeedbackSubmit("menarik")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Menarik
              </button>

              <button
                onClick={() => handleFeedbackSubmit("biasa saja")}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-6a1 1 0 112 0 1 1 0 01-2 0zm3 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
                Biasa Saja
              </button>

              <button
                onClick={() => handleFeedbackSubmit("tidak menarik")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                Tidak Menarik
              </button>
            </div>

            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full mt-4 text-slate-400 hover:text-white py-2 text-sm transition-colors"
            >
              Lewati
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar - Kiri */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 ease-in-out overflow-hidden bg-slate-800 shadow-2xl`}
        >
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Daftar Video</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    // Auto close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full text-left rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedVideo.id === video.id
                      ? "ring-2 ring-blue-500 bg-slate-700"
                      : "bg-slate-700/50 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex flex-col gap-2 p-2">
                    {/* Thumbnail */}
                    <div className="relative w-full h-24 bg-slate-600 rounded overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h4 className={`font-semibold text-xs mb-1 line-clamp-2 ${
                        selectedVideo.id === video.id ? "text-blue-300" : "text-white"
                      }`}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Toggle Button */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
            <div className="px-6 py-4 flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Neuro AI Video Player</h1>
                <p className="text-sm text-slate-400">Pilih video yang ingin Anda tonton</p>
              </div>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                {/* YouTube player container (YT IFrame API will replace this). Falls back to iframe for non-YouTube links. */}
                <div className="w-full aspect-video">
                  {(() => {
                    const match = selectedVideo.url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/);
                    const videoId = match ? match[1] : null;
                    if (videoId) {
                      return <div id={`youtube-player-${selectedVideo.id}`} className="w-full h-full" />;
                    }
                    // fallback: direct iframe
                    return (
                      <iframe
                        key={selectedVideo.id}
                        src={getYouTubeEmbedUrl(selectedVideo.url)}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}
                </div>
                
                {/* Video Info */}
                <div className="p-5 bg-slate-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2">
                        {selectedVideo.title}
                      </h2>
                      <p className="text-slate-300 mb-3 text-sm">
                        {selectedVideo.description}
                      </p>
                    </div>
                    {videoFeedback[selectedVideo.id] && (
                      <div className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30">
                        {videoFeedback[selectedVideo.id] === "menarik" && "👍 Menarik"}
                        {videoFeedback[selectedVideo.id] === "biasa saja" && "😐 Biasa Saja"}
                        {videoFeedback[selectedVideo.id] === "tidak menarik" && "👎 Tidak Menarik"}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Durasi: {selectedVideo.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center text-slate-400 text-sm">
                <p>
                  {isSidebarOpen 
                    ? "Klik pada video di sidebar untuk mengubah video yang diputar" 
                    : "Klik tombol di kiri atas untuk membuka daftar video"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OldHome() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
