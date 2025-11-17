"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FinishPage() {
	const router = useRouter();

	useEffect(() => {
		// Clear survey session data
		localStorage.removeItem("surveyStarted");
		localStorage.removeItem("currentVideoIndex");
		localStorage.removeItem("lastWatchedVideoId");
		// Keep randomizedVideoOrder untuk referensi jika diperlukan
	}, []);

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