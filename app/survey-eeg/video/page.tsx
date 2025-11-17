"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const VIDEO_LIST = [
	{
		id: "video_1",
		url: "/videos/Video Biologi Redominasi FIX.mp4",
		title: "Video 1",
	},
	{
		id: "video_2",
		url: "/videos/Video FIKOM Gravity FIX.mp4",
		title: "Video 2",
	},
	{
		id: "video_3",
		url: "/videos/Video FIKOM Model Komunikasi FIX.mp4",
		title: "Video 3",
	},
	{
		id: "video_4",
		url: "/videos/Video Indonesia Core FIX.mp4",
		title: "Video 4",
	},
	{
		id: "video_5",
		url: "/videos/Video Kucing FIX.mp4",
		title: "Video 5",
	},
	{
		id: "video_6",
		url: "/videos/Video Kucing Gemoy FIX.mp4",
		title: "Video 6",
	},
	{
		id: "video_7",
		url: "/videos/Video Meme 1 FIX.mp4",
		title: "Video 7",
	},
	{
		id: "video_8",
		url: "/videos/Video MUKBANG FIX.mp4",
		title: "Video 8",
	},
	{
		id: "video_9",
		url: "/videos/Video FIKOM Analisis FIX.mp4",
		title: "Video 9",
	},
	{
		id: "video_10",
		url: "/videos/Video FAPERTA Dasar Genetika FIX.mp4",
		title: "Video 10",
	},
];

// Fungsi untuk randomize array
function shuffleArray(array: any[]) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export default function VideoPage() {
	const router = useRouter();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [randomizedVideos, setRandomizedVideos] = useState<any[]>([]);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	useEffect(() => {
		// Cek apakah survey sudah dimulai
		const surveyStarted = localStorage.getItem("surveyStarted");
		if (!surveyStarted) {
			router.push("/survey-eeg");
			return;
		}

		// Ambil atau buat urutan video random
		let videoOrder = localStorage.getItem("randomizedVideoOrder");
		
		if (!videoOrder) {
			// Buat urutan random baru
			const shuffled = shuffleArray(VIDEO_LIST);
			localStorage.setItem("randomizedVideoOrder", JSON.stringify(shuffled));
			setRandomizedVideos(shuffled);
		} else {
			// Gunakan urutan yang sudah ada
			setRandomizedVideos(JSON.parse(videoOrder));
		}

		// Ambil index video saat ini
		const savedIndex = parseInt(
			localStorage.getItem("currentVideoIndex") || "0"
		);
		setCurrentVideoIndex(savedIndex);
		setIsLoading(false);
	}, [router]);

	const handleVideoEnd = () => {
		// Simpan ID video yang baru saja ditonton
		localStorage.setItem(
			"lastWatchedVideoId",
			randomizedVideos[currentVideoIndex].id
		);

		// Redirect ke halaman survey
		router.push("/survey-eeg/survey");
	};

	// Track waktu video
	const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
		const video = e.currentTarget;
		setCurrentTime(video.currentTime);
	};

	// Get duration video
	const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
		const video = e.currentTarget;
		setDuration(video.duration);
	};

	// // Toggle play/pause
	// const togglePlayPause = () => {
	// 	if (videoRef.current) {
	// 		if (isPlaying) {
	// 			videoRef.current.pause();
	// 		} else {
	// 			videoRef.current.play();
	// 		}
	// 		setIsPlaying(!isPlaying);
	// 	}
	// };

	// Format waktu (detik ke MM:SS)
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (isLoading || randomizedVideos.length === 0) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	const currentVideo = randomizedVideos[currentVideoIndex];

	return (
		<div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
			{/* Info video */}
			<div className="absolute top-8 left-8 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
				<p className="text-sm">
					Video {currentVideoIndex + 1} dari {randomizedVideos.length}
				</p>
			</div>

			{/* Video player (tanpa controls bawaan) */}
			<div className="w-full max-w-4xl relative">
				<video
					ref={videoRef}
					className="w-full"
					autoPlay
					onEnded={handleVideoEnd}
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					src={currentVideo.url}
					disablePictureInPicture
					controlsList="nodownload"
					playsInline
				>
					Browser Anda tidak mendukung video tag.
				</video>

				{/* Custom controls overlay */}
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
					<div className="flex items-center justify-between text-white">
						{/* Play/Pause button */}
						{/* <button
							onClick={togglePlayPause}
							className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
						>
							{isPlaying ? (
								<span className="text-2xl">⏸</span>
							) : (
								<span className="text-2xl">▶</span>
							)}
						</button> */}

						{/* Time display */}
						<div className="flex items-center space-x-4">
							<span className="text-lg font-mono">
								{formatTime(currentTime)}
							</span>
							<span className="text-gray-400">/</span>
							<span className="text-lg font-mono">
								{formatTime(duration)}
							</span>
						</div>

						{/* Sisa waktu */}
						<div className="text-right">
							<div className="text-sm text-gray-400">Sisa waktu</div>
							<div className="text-xl font-bold">
								{formatTime(duration - currentTime)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Instruksi */}
			<div className="mt-8 text-center text-white">
				<p className="text-lg">Tonton Video dengan Seksama</p>
				<p className="text-sm text-gray-400 mt-2">
					Relaks, fokus, dan hindari gangguan selama menonton video.
				</p>
			</div>
		</div>
	);
}