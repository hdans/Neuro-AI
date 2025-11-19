"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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

		// Ambil urutan video yang sudah di-random di halaman landing
		const videoOrder = localStorage.getItem("randomizedVideoOrder");
		
		if (videoOrder) {
			setRandomizedVideos(JSON.parse(videoOrder));
		} else {
			// Fallback: jika tidak ada, redirect (tidak seharusnya terjadi)
			router.push("/survey-eeg");
			return;
		}

		// Ambil index video saat ini
		const savedIndex = parseInt(
			localStorage.getItem("currentVideoIndex") || "0"
		);
		setCurrentVideoIndex(savedIndex);
		setIsLoading(false);

		// Mulai tracking fase video
		const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");
		phases.push({
			phase: `video_${savedIndex + 1}`,
			startTime: new Date().toISOString(),
		});
		localStorage.setItem("surveyPhases", JSON.stringify(phases));
	}, [router]);

	// Preload video berikutnya saat video saat ini sedang diputar
	useEffect(() => {
		if (randomizedVideos.length > 0 && currentVideoIndex < randomizedVideos.length - 1) {
			const nextIndex = currentVideoIndex + 1;
			const nextVideoUrl = randomizedVideos[nextIndex].url;
			
			// Preload video berikutnya di background
			const videoPreloader = document.createElement('video');
			videoPreloader.src = nextVideoUrl;
			videoPreloader.preload = 'auto';
			videoPreloader.load();
			
			console.log('Background preloading:', nextVideoUrl);
		}
	}, [currentVideoIndex, randomizedVideos]);

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
				<p className="text-lg">Tonton video hingga selesai</p>
				<p className="text-sm text-gray-400 mt-2">
					Setelah video selesai, Anda akan diminta memberikan rating
				</p>
			</div>
		</div>
	);
}