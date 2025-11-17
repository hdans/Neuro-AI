"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TimestampPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(35);

	useEffect(() => {
		// Cek apakah survey sudah dimulai
		const surveyStarted = localStorage.getItem("surveyStarted");
		if (!surveyStarted) {
			router.push("/survey-eeg");
			return;
		}

		// Countdown timer
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					// Redirect ke halaman video
					setTimeout(() => {
						router.push("/survey-eeg/video");
					}, 100);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [router]);

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center">
			<div className="text-center">
				{/* Countdown di pojok kanan atas */}
				<div className="fixed top-8 right-8 bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-800">{countdown}</div>
						<div className="text-xs text-gray-600">detik</div>
					</div>
				</div>

				{/* Simbol fokus + di tengah */}
				<div className="flex flex-col items-center">
					<div className="text-white text-9xl font-light mb-8">+</div>
					<p className="text-white text-lg opacity-75">
						Fokuskan pandangan Anda pada simbol di atas
					</p>
				</div>

				{/* Progress bar */}
				<div className="fixed bottom-0 left-0 right-0 h-2 bg-gray-800">
					<div
						className="h-full bg-blue-500 transition-all duration-1000"
						style={{ width: `${((35 - countdown) / 35) * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}