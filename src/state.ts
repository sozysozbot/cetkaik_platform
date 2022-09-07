import { State } from "./types";

function getInitialState(o: {
	ia_side: {
		player_name_short: string,
		player_name: string
	},
	a_side: {
		player_name_short: string,
		player_name: string,
	},
}): State {
	return {
		season: "春",
		turn: 1,
		rate: 1,
		focus: null,
		board: {
			K: {
				A: { color: "黒", prof: "筆", is_aside: true },
				E: { color: "赤", prof: "巫", is_aside: true },
				I: { color: "黒", prof: "兵", is_aside: true },
				AI: { color: "黒", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "巫", is_aside: false },
				IA: { color: "赤", prof: "筆", is_aside: false },
			},
			L: {
				A: { color: "黒", prof: "馬", is_aside: true },
				E: { color: "赤", prof: "弓", is_aside: true },
				I: { color: "赤", prof: "兵", is_aside: true },
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "弓", is_aside: false },
				IA: { color: "赤", prof: "馬", is_aside: false },
			},
			N: {
				A: { color: "黒", prof: "車", is_aside: true },
				I: { color: "黒", prof: "兵", is_aside: true },
				AI: { color: "黒", prof: "兵", is_aside: false },
				IA: { color: "赤", prof: "車", is_aside: false },
			},
			T: {
				A: { color: "黒", prof: "将", is_aside: true },
				E: { color: "赤", prof: "虎", is_aside: true },
				I: { color: "赤", prof: "兵", is_aside: true },
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "虎", is_aside: false },
				IA: { color: "赤", prof: "将", is_aside: false },
			},
			Z: {
				A: { color: "赤", prof: "王", is_aside: true },
				I: { color: "赤", prof: "船", is_aside: true },
				O: "皇",
				AI: { color: "黒", prof: "船", is_aside: false },
				IA: { color: "黒", prof: "王", is_aside: false },
			},
			X: {
				A: { color: "赤", prof: "将", is_aside: true },
				E: { color: "黒", prof: "虎", is_aside: true },
				I: { color: "赤", prof: "兵", is_aside: true },
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "赤", prof: "虎", is_aside: false },
				IA: { color: "黒", prof: "将", is_aside: false },
			},
			C: {
				A: { color: "赤", prof: "車", is_aside: true },
				I: { color: "黒", prof: "兵", is_aside: true },
				AI: { color: "黒", prof: "兵", is_aside: false },
				IA: { color: "黒", prof: "車", is_aside: false },
			},
			M: {
				A: { color: "赤", prof: "馬", is_aside: true },
				E: { color: "黒", prof: "弓", is_aside: true },
				I: { color: "赤", prof: "兵", is_aside: true },
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "赤", prof: "弓", is_aside: false },
				IA: { color: "黒", prof: "馬", is_aside: false },
			},
			P: {
				A: { color: "赤", prof: "筆", is_aside: true },
				E: { color: "黒", prof: "巫", is_aside: true },
				I: { color: "黒", prof: "兵", is_aside: true },
				AI: { color: "黒", prof: "兵", is_aside: false },
				AU: { color: "赤", prof: "巫", is_aside: false },
				IA: { color: "黒", prof: "筆", is_aside: false },
			}
		},
		ia_side: {
			player_name_short: o.ia_side.player_name_short,
			hop1zuo1: [],
			player_name: o.ia_side.player_name,
			score: 20,
		},
		a_side: {
			player_name_short: o.a_side.player_name_short,
			player_name: o.a_side.player_name,
			hop1zuo1: [],
			score: 20,
		},
	}
}

export function getNthState(n: number): State {
	if (n == 1) {
		return getInitialState({
			ia_side: {
				player_name_short: "筆",
				player_name: "筆墨風"
			},
			a_side: {
				player_name_short: "星",
				player_name: "星享青",
			}
		})
	}
	return {
		season: "秋",
		turn: n,
		rate: 4,
		focus: ["P", "O"],
		board: {
			C: {
				AI: { color: "黒", prof: "車", is_aside: false },
				E: { color: "赤", prof: "将", is_aside: true },
				I: { color: "赤", prof: "車", is_aside: true },
				U: { color: "黒", prof: "兵", is_aside: true },
				Y: { color: "黒", prof: "兵", is_aside: false },
			},
			K: {
				A: { color: "黒", prof: "筆", is_aside: true },
				AI: { color: "黒", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "巫", is_aside: false },
				E: { color: "赤", prof: "巫", is_aside: true },
				IA: { color: "赤", prof: "筆", is_aside: false },
				U: { color: "黒", prof: "兵", is_aside: true }
			},
			L: {
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "弓", is_aside: false },
				E: { color: "赤", prof: "弓", is_aside: true },
				IA: { color: "赤", prof: "馬", is_aside: false },
				U: { color: "赤", prof: "兵", is_aside: true }
			},
			M: {
				A: { color: "赤", prof: "馬", is_aside: true },
				AU: { color: "赤", prof: "弓", is_aside: false },
				I: { color: "赤", prof: "兵", is_aside: true },
				IA: { color: "黒", prof: "馬", is_aside: false },
				O: { color: "赤", prof: "兵", is_aside: false }
			},
			N: {
				AI: { color: "赤", prof: "将", is_aside: false },
				AU: { color: "赤", prof: "車", is_aside: false },
				I: { color: "黒", prof: "兵", is_aside: true },
				Y: { color: "黒", prof: "兵", is_aside: false }
			},
			P: {
				A: { color: "赤", prof: "筆", is_aside: true },
				AU: { color: "赤", prof: "巫", is_aside: false },
				E: { color: "黒", prof: "巫", is_aside: true },
				I: { color: "黒", prof: "弓", is_aside: true },
				IA: { color: "黒", prof: "筆", is_aside: false },
				U: { color: "黒", prof: "兵", is_aside: true },
				O: { color: "黒", prof: "兵", is_aside: false },
			},
			T: {
				A: { color: "赤", prof: "王", is_aside: true },
				AI: { color: "赤", prof: "兵", is_aside: false },
				AU: { color: "黒", prof: "虎", is_aside: false },
				E: { color: "黒", prof: "車", is_aside: true },
				I: { color: "赤", prof: "兵", is_aside: true }
			},
			X: {
				AU: { color: "赤", prof: "兵", is_aside: true },
				E: { color: "黒", prof: "虎", is_aside: true },
				I: { color: "黒", prof: "将", is_aside: true }
			},
			Z: {
				A: { color: "赤", prof: "虎", is_aside: true },
				AI: { color: "黒", prof: "船", is_aside: false },
				IA: { color: "黒", prof: "王", is_aside: false },
				O: "皇",
				U: { color: "赤", prof: "船", is_aside: true },
				Y: { color: "黒", prof: "将", is_aside: false }
			},
		},
		ia_side: {
			player_name_short: "筆",
			hop1zuo1: [{ color: "黒", prof: "馬", is_aside: false }],
			player_name: "筆墨風",
			score: 28,
		},
		a_side: {
			player_name_short: "星",
			player_name: "星享青",
			hop1zuo1: [{ color: "赤", prof: "兵", is_aside: true }, { color: "赤", prof: "虎", is_aside: true }],
			score: 12,
		},

	};

}