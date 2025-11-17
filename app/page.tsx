import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              Neuro<span className="text-blue-600">AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
                Beranda
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                Tentang
              </a>
              <Link
                href="/register"
                className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-5 py-2 mb-8">
            <span className="text-red-500">🔥</span>
            <span className="text-gray-700 text-sm font-medium">
              Latest Release: <span className="font-semibold">New Dashboard</span>
            </span>
            <span className="text-gray-400">→</span>
          </div> */}

          {/* Main Heading */}
          <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Meningkatkan Keefektifan Video Pembelajaran melalui EEG, Eye-Tracking, dan AI
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
           Platform pengambilan data yang bertujuan untuk menentukan keefektifan video pembelajaran berdasarkan data responden.
          </p>

          {/* CTA Button */}
          <Link
            href="/register"
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Isi Survey Sekarang
          </Link>

          {/* Mockup Image */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
                {/* <div className="text-center">
                  <div className="text-6xl mb-4">💼</div>
                  <p className="text-gray-500 font-medium">Dashboard Preview</p>
                </div> */}
                <Image
                  src="/dashboard.png"
                  alt="Tampilan dashboard utama."
                  width={1000}
                  height={800}
                >
                </Image>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tentang NeuroAI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NeuroAI adalah prototype untuk membantu efektifitas video pembelajaran dengan Machine Learning yang menggunakan 3 data berikut:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-102 shadow-lg">
              {/* <div className="text-4xl mb-4">⏱️</div> */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">EEG (Electroencephalography)</h3>
              <p className="text-gray-600">
                EEG adalah data aktivitas listrik otak yang direkam melalui sensor yang ditempatkan di permukaan kepala. Data ini merepresentasikan pola gelombang otak seperti alpha, beta, theta, dan gamma yang berkaitan dengan tingkat fokus, beban kognitif, kelelahan, serta tingkat keterlibatan responden.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-102 shadow-lg">
              {/* <div className="text-4xl mb-4">💰</div> */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Eye <br /> Tracking</h3>
              <p className="text-gray-600">
                Eye tracking adalah proses merekam pergerakan dan fokus pandangan mata selama peserta menonton video. Data yang diperoleh termasuk fixation points, saccades, pupil dilation, dan arah pandangan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-102 shadow-lg">
              {/* <div className="text-4xl mb-4">🤝</div> */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Face <br /> Detection</h3>
              <p className="text-gray-600">
                Face detection adalah data yang dihasilkan dari deteksi dan analisis ekspresi wajah menggunakan kamera, termasuk identifikasi emosi dasar seperti senang, terkejut, fokus, bosan, atau bingung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © <a className="hover:underline" href="https://github.com/hdans/Neuro-AI">Neuro AI : Dafa | Hafizh | Danish | Dzikri | Ainur </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}