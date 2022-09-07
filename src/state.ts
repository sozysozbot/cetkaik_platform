import { BodyElement, Parsed } from "cerke_online_kiaak_parser";
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
		turn: 0,
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

export function getNextState(current_state: Readonly<State>, body_element: BodyElement): State | null {
	const new_state: State = JSON.parse(JSON.stringify(current_state));
	if (body_element.type === "season_ends") {
		if (current_state.season === "冬") {
			return null;
		}
		new_state.season =
			current_state.season === "春" ? "夏" :
				current_state.season === "夏" ? "秋" :
					current_state.season === "秋" ? "冬" :
						(() => { throw new Error() })();
		new_state.turn = 0;
		return new_state;
	}
	return new_state;
}

export function getAllStatesFromParsed(parsed: Readonly<Parsed>): State[] {
	const ans: State[] = [];
	let current_state = getInitialState({
		ia_side: { player_name_short: "張", player_name: "張三" },
		a_side: { player_name_short: "李", player_name: "李四" }
	});
	for (let i = 0; i < parsed.parsed_bodies.length; i++) {
		const next_state = getNextState(current_state, parsed.parsed_bodies[i]);
		if (!next_state) break;
		ans.push(next_state);
		current_state = next_state;
	}
	return ans;
}
