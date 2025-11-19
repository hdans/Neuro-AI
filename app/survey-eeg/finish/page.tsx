"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FinishPage() {
	const router = useRouter();
	const [surveyDuration, setSurveyDuration] = useState(0);
	const [isSendingData, setIsSendingData] = useState(true);

	useEffect(() => {
		// Hitung durasi survey
		const startTimeStr = localStorage.getItem("surveyStartTime");
		
		if (startTimeStr) {
			const startTime = new Date(startTimeStr);
			const endTime = new Date();
			const durationMs = endTime.getTime() - startTime.getTime();
			const durationSeconds = Math.floor(durationMs / 1000);
			
			setSurveyDuration(durationSeconds);

			// Ambil data user untuk mengirim durasi
			const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
			const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");

			// Format timing details untuk dikirim ke sheets
			const timingDetails = phases.map((p: any) => 
				`${p.phase}:${p.durationSeconds}s`
			).join(" | ");

			// Kirim data durasi survey ke Google Sheets
			const completionData = {
				userName: currentUser.name || "-",
				userEmail: currentUser.email || "-",
				userGender: currentUser.gender || "-",
				userAge: currentUser.age || "-",
				videoId: "COMPLETION",
				rating: "Survey Selesai",
				confidence: Math.ceil(durationSeconds / 60), // Durasi dalam menit
				timestamp: endTime.toISOString(),
				surveyDuration: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
				timingDetails: timingDetails,
			};

			// Kirim ke Google Apps Script
			fetch(
				"https://script.google.com/macros/s/AKfycbwwPfBl2rgHdS7ItP5UW8ElDmbJ2D2ktLTT1eUOqn93q842Q8j7VXpdRrJXQCPQrDG4/exec",
				{
					method: "POST",
					mode: "no-cors",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(completionData),
				}
			)
				.then(() => {
					console.log("Survey completion data sent");
					setIsSendingData(false);
				})
				.catch((error) => {
					console.error("Error sending completion data:", error);
					setIsSendingData(false);
				});
		}

		// Clear survey session data
		return () => {
			localStorage.removeItem("surveyStarted");
			localStorage.removeItem("currentVideoIndex");
			localStorage.removeItem("lastWatchedVideoId");
			localStorage.removeItem("randomizedVideoOrder");
			localStorage.removeItem("surveyStartTime");
			localStorage.removeItem("surveyPhases");
		};
	}, []);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		} else {
			return `${secs}s`;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4">
			<div className="bg-white rounded-lg shadow-2xl p-12 max-w-2xl w-full text-center">
				<div className="mb-8">
					<div className="text-8xl mb-4">🎉</div>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Selamat!
					</h1>
					<h2 className="text-2xl text-gray-700 mb-2">
						Survey EEG Telah Selesai
					</h2>
				</div>

				{/* Duration Display */}
				<div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-8">
					<div className="text-sm text-gray-600 mb-2">Total Waktu Survey</div>
					<div className="text-5xl font-bold text-blue-600">
						{formatDuration(surveyDuration)}
					</div>
					{isSendingData && (
						<div className="text-sm text-gray-500 mt-3">
							⏳ Mengirim data...
						</div>
					)}
					{!isSendingData && (
						<div className="text-sm text-green-600 mt-3">
							✓ Data berhasil dikirim
						</div>
					)}
				</div>

				<div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
					<p className="text-gray-700 text-lg leading-relaxed">
						Terima kasih atas partisipasi Anda dalam penelitian ini. Data yang
						Anda berikan sangat berharga untuk kemajuan penelitian kami dalam
						bidang neuroscience dan pemahaman aktivitas otak manusia.
					</p>
				</div>

				<div className="space-y-4 text-left mb-8">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
							✓
						</div>
						<p className="text-gray-700">10 video telah ditonton</p>
					</div>
					<div className="flex items-center">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
							✓
						</div>
						<p className="text-gray-700">10 rating telah diberikan</p>
					</div>
					<div className="flex items-center">
						<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
							✓
						</div>
						<p className="text-gray-700">Data telah tersimpan dengan aman</p>
					</div>
				</div>

				<div className="space-y-4">
					<Link
						href="/dashboard"
						className="block w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
					>
						Kembali ke Dashboard
					</Link>

					<button
						onClick={() => {
							// Reset untuk survey baru
							localStorage.removeItem("randomizedVideoOrder");
							router.push("/survey-eeg");
						}}
						className="block w-full bg-white border-2 border-gray-800 text-gray-800 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
					>
						Mulai Survey Baru
					</button>
				</div>

				<p className="text-sm text-gray-500 mt-8">
					Jika Anda memiliki pertanyaan tentang penelitian ini, silakan hubungi
					tim peneliti kami.
				</p>
			</div>
		</div>
	);
}