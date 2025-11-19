"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(35);
	const [rating, setRating] = useState("");
	const [confidence, setConfidence] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showBreathing, setShowBreathing] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		gender: "",
		age: "",
	});
	const [lastVideoId, setLastVideoId] = useState("");
	const [surveyStartTime, setSurveyStartTime] = useState<Date | null>(null);

	useEffect(() => {
		// Ambil data user dari localStorage
		const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
		if (currentUser.email) {
			setUserData({
				name: currentUser.name || "",
				email: currentUser.email || "",
				gender: currentUser.gender || "",
				age: currentUser.age || "",
			});
		}

		// Ambil waktu mulai survey
		const startTimeStr = localStorage.getItem("surveyStartTime");
		if (startTimeStr) {
			setSurveyStartTime(new Date(startTimeStr));
		}

		// Ambil ID video yang baru ditonton
		const videoId = localStorage.getItem("lastWatchedVideoId") || "";
		setLastVideoId(videoId);

		// Mulai tracking fase survey
		const currentIndex = parseInt(
			localStorage.getItem("currentVideoIndex") || "0"
		);
		const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");
		phases.push({
			phase: `survey_${currentIndex + 1}`,
			startTime: new Date().toISOString(),
		});
		localStorage.setItem("surveyPhases", JSON.stringify(phases));

		// Countdown timer
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!rating || !confidence) {
			alert("Mohon isi semua field");
			return;
		}

		// Data yang akan dikirim ke Google Sheets
		const surveyData = {
			userName: userData.name,
			userEmail: userData.email,
			userGender: userData.gender,
			userAge: userData.age,
			videoId: lastVideoId,
			rating: rating,
			confidence: confidence,
			timestamp: new Date().toISOString(),
		};

		try {
			// Kirim ke Google Apps Script
			const response = await fetch(
				"https://script.google.com/macros/s/AKfycbz-mxdQjMsaL4CB2YsABkNh3flapK_ykljm8hkdFW_TQzCihpGIOAeTY8_WAhNjOUTH/exec",
				{
					method: "POST",
					mode: "no-cors",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(surveyData),
				}
			);

			console.log("Survey data sent:", surveyData);
		} catch (error) {
			console.error("Error sending survey data:", error);
		}

		setIsSubmitted(true);
		setShowBreathing(true);

		// Tampilkan breathing instruction hingga countdown habis
		// Gunakan sisa waktu countdown yang ada
		const remainingTime = countdown * 1000; // Convert ke milliseconds
		
		setTimeout(() => {
			// Setelah countdown habis, tampilkan loading 3 detik
			setShowLoading(true);
			
			// Preload video berikutnya selama loading
			const currentIndex = parseInt(
				localStorage.getItem("currentVideoIndex") || "0"
			);
			const nextIndex = currentIndex + 1;
			const randomizedVideos = JSON.parse(
				localStorage.getItem("randomizedVideoOrder") || "[]"
			);
			
			if (nextIndex < randomizedVideos.length) {
				// Preload video berikutnya
				const nextVideoUrl = randomizedVideos[nextIndex].url;
				const videoPreloader = document.createElement('video');
				videoPreloader.src = nextVideoUrl;
				videoPreloader.preload = 'auto';
				videoPreloader.load();
				
				console.log('Preloading next video:', nextVideoUrl);
			}
			
			// Setelah 3 detik loading, baru pindah ke video berikutnya
			setTimeout(() => {
				// Set endTime untuk fase survey
				const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");
				if (phases.length > 0 && !phases[phases.length - 1].endTime) {
					const lastPhase = phases[phases.length - 1];
					const endTime = new Date();
					lastPhase.endTime = endTime.toISOString();
					lastPhase.durationSeconds = Math.floor(
						(endTime.getTime() - new Date(lastPhase.startTime).getTime()) / 1000
					);
					localStorage.setItem("surveyPhases", JSON.stringify(phases));
					console.log("Survey phase ended (with break):", lastPhase);
				}

				if (nextIndex < randomizedVideos.length) {
					// Masih ada video, lanjut ke video berikutnya
					localStorage.setItem("currentVideoIndex", nextIndex.toString());
					router.push("/survey-eeg/video");
				} else {
					// Semua video sudah selesai
					router.push("/survey-eeg/finish");
				}
			}, 3000); // Loading 3 detik
		}, remainingTime);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
				{/* Countdown */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Rating Video
					</h1>
					<div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
						<div className="text-center">
							<div className="text-xl font-bold">{countdown}</div>
							<div className="text-xs">detik</div>
						</div>
					</div>
				</div>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-lg font-medium text-gray-800 mb-4">
								Bagaimana menurut Anda video yang barusan ditonton?
							</label>
							<div className="space-y-3">
								<label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="rating"
										value="Menarik"
										onChange={(e) => setRating(e.target.value)}
										className="w-5 h-5 text-blue-600"
										required
									/>
									<span className="ml-3 text-gray-800 font-medium">
										😊 Menarik
									</span>
								</label>

								<label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="rating"
										value="Biasa Saja"
										onChange={(e) => setRating(e.target.value)}
										className="w-5 h-5 text-blue-600"
										required
									/>
									<span className="ml-3 text-gray-800 font-medium">
										😐 Biasa Saja
									</span>
								</label>

								<label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										type="radio"
										name="rating"
										value="Tidak Menarik"
										onChange={(e) => setRating(e.target.value)}
										className="w-5 h-5 text-blue-600"
										required
									/>
									<span className="ml-3 text-gray-800 font-medium">
										😞 Tidak Menarik
									</span>
								</label>
							</div>
						</div>

						<div>
							<label className="block text-lg font-medium text-gray-800 mb-3">
								Confidence Score (seberapa yakin dengan jawaban Anda?)
								<span className="text-red-500">*</span>
							</label>
							<select
								value={confidence}
								onChange={(e) => setConfidence(e.target.value)}
								className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
								required
							>
								<option value="">Pilih confidence score</option>
								<option value="1">1 - Sangat Tidak Yakin</option>
								<option value="2">2 - Tidak Yakin</option>
								<option value="3">3 - Netral</option>
								<option value="4">4 - Yakin</option>
								<option value="5">5 - Sangat Yakin</option>
							</select>
						</div>

						<button
							type="submit"
							className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
						>
							Kirim Rating
						</button>
					</form>
				) : (
					<div className="text-center py-8">
						{!showBreathing ? (
							<>
								<div className="text-5xl mb-4">✓</div>
								<p className="text-xl text-gray-800 font-medium">
									Terima kasih atas rating Anda!
								</p>
							</>
						) : !showLoading ? (
							<div className="py-8">
								<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-12 mb-6">
									<div className="text-6xl mb-6 animate-pulse">🌬️</div>
									<h2 className="text-3xl font-bold text-gray-800 mb-3">
										Silakan tarik napas dalam...
									</h2>
									<p className="text-xl text-gray-600 mb-4">lalu hembuskan...</p>
									<div className="text-4xl font-bold text-blue-600 mt-6">
										{countdown}
									</div>
									<p className="text-sm text-gray-500 mt-2">detik tersisa</p>
								</div>
								<p className="text-sm text-gray-500">
									Bersiap untuk video berikutnya...
								</p>
							</div>
						) : (
							<div className="py-8">
								<div className="bg-gray-50 rounded-lg p-12">
									<div className="flex justify-center mb-6">
										<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800"></div>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 mb-2">
										Memuat video berikutnya...
									</h2>
									<p className="text-gray-600">Mohon tunggu sebentar</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Progress bar */}
				<div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						className="h-full bg-blue-500 transition-all duration-1000"
						style={{ width: `${((35 - countdown) / 35) * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}