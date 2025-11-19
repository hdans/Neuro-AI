// Hook untuk tracking waktu setiap fase survey

export interface TimingPhase {
	phase: string;
	startTime: string;
	endTime?: string;
	durationSeconds?: number;
}

export function useTimingTracker() {
	const startPhase = (phaseName: string) => {
		const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");
		
		// Jika ada fase yang belum selesai, simpan end time
		if (phases.length > 0 && !phases[phases.length - 1].endTime) {
			const lastPhase = phases[phases.length - 1];
			const endTime = new Date();
			lastPhase.endTime = endTime.toISOString();
			lastPhase.durationSeconds = Math.floor(
				(endTime.getTime() - new Date(lastPhase.startTime).getTime()) / 1000
			);
		}

		// Mulai fase baru
		const newPhase: TimingPhase = {
			phase: phaseName,
			startTime: new Date().toISOString(),
		};

		phases.push(newPhase);
		localStorage.setItem("surveyPhases", JSON.stringify(phases));
	};

	const endPhase = () => {
		const phases = JSON.parse(localStorage.getItem("surveyPhases") || "[]");

		if (phases.length > 0 && !phases[phases.length - 1].endTime) {
			const lastPhase = phases[phases.length - 1];
			const endTime = new Date();
			lastPhase.endTime = endTime.toISOString();
			lastPhase.durationSeconds = Math.floor(
				(endTime.getTime() - new Date(lastPhase.startTime).getTime()) / 1000
			);
			localStorage.setItem("surveyPhases", JSON.stringify(phases));
		}
	};

	const getAllPhases = (): TimingPhase[] => {
		return JSON.parse(localStorage.getItem("surveyPhases") || "[]");
	};

	const clearPhases = () => {
		localStorage.removeItem("surveyPhases");
	};

	return { startPhase, endPhase, getAllPhases, clearPhases };
}