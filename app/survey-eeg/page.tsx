"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function SurveyEEGPage() {
	const router = useRouter();

	const handleStartSurvey = () => {
		// Inisialisasi survey session dengan timestamp
		const sessionId = Date.now().toString();
		const startTime = new Date();
		
		// Buat random video order SEKALI saja untuk sesi ini
		const shuffled = shuffleArray(VIDEO_LIST);
		
		// Inisialisasi tracking waktu
		localStorage.setItem("surveyPhases", JSON.stringify([]));
		
		localStorage.setItem("surveySessionId", sessionId);
		localStorage.setItem("surveyStartTime", startTime.toISOString());
		localStorage.setItem("surveyStarted", "true");
		localStorage.setItem("currentVideoIndex", "0");
		localStorage.setItem("randomizedVideoOrder", JSON.stringify(shuffled));
		
		router.push("/survey-eeg/timestamp");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Survey Penelitian EEG
					</h1>
					<Link
						href="/dashboard"
						className="text-gray-600 hover:text-gray-800 transition-colors"
					>
						← Kembali
					</Link>
				</div>

				<div className="space-y-6">
					<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
						<h2 className="font-bold text-gray-800 mb-2">
							Tentang Penelitian Ini
						</h2>
						<p className="text-gray-700 text-sm">
							Anda akan berpartisipasi dalam penelitian yang menggunakan
							teknologi EEG (Electroencephalography) untuk mengukur aktivitas
							otak saat menonton video.
						</p>
					</div>

					<div className="space-y-4">
						<h3 className="font-bold text-gray-800 text-lg">
							Langkah-langkah Survey:
						</h3>
						
						<div className="space-y-3">
							<div className="flex items-start">
								<div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
									1
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-gray-800">
										Sesi Fokus (35 detik)
									</h4>
									<p className="text-gray-600 text-sm">
										Anda akan diminta fokus pada simbol "+" di tengah layar
										selama 35 detik.
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
									2
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-gray-800">
										Menonton Video (10 video)
									</h4>
									<p className="text-gray-600 text-sm">
										Anda akan menonton 10 video secara berurutan. Setiap video
										berdurasi pendek.
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
									3
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-gray-800">
										Rating & Istirahat (35 detik)
									</h4>
									<p className="text-gray-600 text-sm">
										Setelah setiap video, berikan rating dan confidence score
										Anda, lalu istirahat 35 detik.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
						<h3 className="font-bold text-gray-800 mb-2">⚠️ Catatan Penting</h3>
						<ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
							<li>Pastikan Anda berada di tempat yang tenang</li>
							<li>Gunakan headphone untuk pengalaman terbaik</li>
							<li>Jangan refresh atau keluar dari halaman selama survey</li>
							<li>Total waktu survey sekitar 18-20 menit</li>
						</ul>
					</div>

					<button
						onClick={handleStartSurvey}
						className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg mt-6"
					>
						Mulai Survey
					</button>
				</div>
			</div>
		</div>
	);
}