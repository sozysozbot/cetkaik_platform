import { BodyElement, Parsed, CiurlEvent } from "cerke_online_kiaak_parser";
import { Board, fromHanziSeason, HanziColor, HanziProfession, NonTamPiece, State, toHanziColor, toHanziProfession } from "./types";
import { AbsoluteCoord, Color, Profession } from "cerke_online_api";

function getInitialBoard(): Board {
	return {
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
	}
}

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
		whose_turn: null,
		focus: {
			actual_final_dest: null,
			stepped: null,
			src: null,
			initially_planned_dest: null
		},
		board: getInitialBoard(),
		ia_side: {
			player_name_short: o.ia_side.player_name_short,
			hop1zuo1: [],
			player_name: o.ia_side.player_name,
			score: 20,
			is_newly_acquired: false,
		},
		a_side: {
			player_name_short: o.a_side.player_name_short,
			player_name: o.a_side.player_name,
			hop1zuo1: [],
			score: 20,
			is_newly_acquired: false,
		},
		overlayed_message: null,
	}
}

function remove_from(state: State, coord: AbsoluteCoord): NonTamPiece | "皇" {
	const piece = state.board[coord[1]][coord[0]];
	if (!piece) { throw new Error(`エラー: 座標${coord[1]}${coord[0]}には駒がありません`); }
	delete state.board[coord[1]][coord[0]];
	return piece;
}

function set_to(state: State, coord: AbsoluteCoord, piece: NonTamPiece | "皇"): NonTamPiece | undefined {
	if (state.board[coord[1]][coord[0]]) {
		const captured_piece = state.board[coord[1]][coord[0]];
		if (captured_piece === "皇") {
			throw new Error(`エラー: 座標${coord[1]}${coord[0]}には皇が既にあります`);
		}
		state.board[coord[1]][coord[0]] = piece;
		return captured_piece;
	} else {
		state.board[coord[1]][coord[0]] = piece;
		return undefined;
	}
}

function set_hop1zuo1(state: State, piece: NonTamPiece) {
	if (piece.is_aside) {
		state.ia_side.hop1zuo1.push({ color: piece.color, prof: piece.prof, is_aside: false });
		state.ia_side.is_newly_acquired = true;
	} else {
		state.a_side.hop1zuo1.push({ color: piece.color, prof: piece.prof, is_aside: true });
		state.a_side.is_newly_acquired = true;
	}
}

function remove_from_hop1zuo1(state: State, o: { color: HanziColor, prof: HanziProfession, is_aside: boolean }) {
	const index = state[o.is_aside ? "a_side" : "ia_side"].hop1zuo1.findIndex(k => k.color === o.color && k.prof === o.prof);
	if (index === -1) {
		throw new Error(`エラー: 持ち駒に${o.color}${o.prof}がありません`);
	}
	state[o.is_aside ? "a_side" : "ia_side"].hop1zuo1.splice(index, 1);
}

function isSuccessfullyCompleted(ciurl_event: CiurlEvent): boolean {
	if (ciurl_event.type === "no_ciurl_event") {
		return true;
	} else if (ciurl_event.type === "only_stepping") {
		return ciurl_event.infafterstep_success;
	} else if (ciurl_event.type === "has_water_entry") {
		return ciurl_event.water_entry_ciurl >= 3;
	} else {
		const _: never = ciurl_event;
		throw new Error("Should not reach here: invalid value in ciurl_event.type")
	}
}

export function getNextState(old_state: Readonly<State>, body_element: BodyElement, starting_players: HanziColor[]): State | null {
	const new_state: State = JSON.parse(JSON.stringify(old_state));
	if (old_state.whose_turn === null) {
		new_state.whose_turn = starting_players[fromHanziSeason(old_state.season)] === "赤" ? "a_side" : "ia_side";
	}

	// clear the flags
	new_state.ia_side.is_newly_acquired = false;
	new_state.a_side.is_newly_acquired = false;
	new_state.focus = {
		src: null,
		actual_final_dest: null,
		stepped: null,
		initially_planned_dest: null
	};
	new_state.overlayed_message = null;

	if (body_element.type === "season_ends") {
		if (old_state.season === "冬") {
			return null;
		}
		new_state.season =
			old_state.season === "春" ? "夏" :
				old_state.season === "夏" ? "秋" :
					old_state.season === "秋" ? "冬" :
						(() => { throw new Error() })();
		new_state.turn = 0;
		new_state.whose_turn = null;
		new_state.board = getInitialBoard();
		new_state.overlayed_message = { type: "season_ends", season: old_state.season }
		new_state.a_side.hop1zuo1 = [];
		new_state.ia_side.hop1zuo1 = [];
	} else if (body_element.type === "go_again") {
		new_state.overlayed_message = { type: "go_again" };
	} else if (body_element.type === "game_set") {
		new_state.overlayed_message = { type: "game_set" };
	} else if (body_element.type === "before_taxot") {
		new_state.overlayed_message = { type: "before_taxot", hands: body_element.hands, score: body_element.score };
	} else if (body_element.type === "before_tymok") {
		new_state.overlayed_message = { type: "before_tymok", hands: body_element.hands };
	} else if (body_element.type === "end_season") {
		if (old_state.overlayed_message?.type !== "before_taxot") {
			throw new Error("エラー: 「終季」の前には、獲得した役の一覧が必要です");
		}
		new_state.overlayed_message = { type: "end_season", score: old_state.overlayed_message.score };
	} else if (body_element.type === "from_hopzuo") {
		if (old_state.whose_turn === "ia_side") {
			new_state.whose_turn = "a_side";
		} else if (old_state.whose_turn === "a_side") {
			new_state.whose_turn = "ia_side";
		}
		new_state.turn++;
		const data: {
			type: "FromHop1Zuo1";
			color: Color;
			prof: Profession;
			dest: AbsoluteCoord;
		} = body_element.movement.data;
		const color = toHanziColor(data.color);
		const prof = toHanziProfession(data.prof);
		const is_aside = new_state.whose_turn === "a_side";
		remove_from_hop1zuo1(new_state, { color, prof, is_aside });
		set_to(new_state, data.dest, { color, prof, is_aside });
		new_state.focus = {
			actual_final_dest: data.dest,
			initially_planned_dest: data.dest,
			stepped: null,
			src: is_aside ? "a_side_hop1zuo1" : "ia_side_hop1zuo1"
		}
	} else if (body_element.type === "normal_move") {
		if (old_state.whose_turn === "ia_side") {
			new_state.whose_turn = "a_side";
		} else if (old_state.whose_turn === "a_side") {
			new_state.whose_turn = "ia_side";
		}
		new_state.turn++;
		if (body_element.movement.data.type === "SrcDst") {
			if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
				const piece = remove_from(new_state, body_element.movement.data.src);
				const maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
				if (maybe_captured_piece) {
					set_hop1zuo1(new_state, maybe_captured_piece)
				}
				new_state.focus = {
					src: body_element.movement.data.src,
					actual_final_dest: body_element.movement.data.dest,
					stepped: null,
					initially_planned_dest: body_element.movement.data.dest
				};
			} else {
				// failed attempt
				new_state.focus = {
					src: body_element.movement.data.src,
					actual_final_dest: body_element.movement.data.src,
					stepped: null,
					initially_planned_dest: body_element.movement.data.dest
				};
			}
		} else if (body_element.movement.data.type === "SrcStepDst") {
			if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
				const piece = remove_from(new_state, body_element.movement.data.src);
				const maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
				if (maybe_captured_piece) {
					set_hop1zuo1(new_state, maybe_captured_piece)
				}
				new_state.focus = {
					actual_final_dest: body_element.movement.data.dest,
					stepped: body_element.movement.data.step,
					initially_planned_dest: body_element.movement.data.dest,
					src: body_element.movement.data.src
				};
			} else {
				// failed attempt
				new_state.focus = {
					actual_final_dest: body_element.movement.data.src,
					stepped: body_element.movement.data.step,
					initially_planned_dest: body_element.movement.data.dest, src: body_element.movement.data.src
				};
			}
		} else {
			const _: never = body_element.movement.data;
			throw new Error(`Should not reach here: invalid value in body_element.movement.data.type`);
		}
	
	} else if (body_element.type === "tam_move") {
		if (old_state.whose_turn === "ia_side") {
			new_state.whose_turn = "a_side";
		} else if (old_state.whose_turn === "a_side") {
			new_state.whose_turn = "ia_side";
		}

		const piece = remove_from(new_state, body_element.movement.src);
		const maybe_captured_piece = set_to(new_state, body_element.movement.secondDest, piece);
		if (maybe_captured_piece) {
			throw new Error(`エラー: 皇が行こうとしている${body_element.movement.secondDest[1]}${body_element.movement.secondDest[0]}には${maybe_captured_piece.color}${maybe_captured_piece.prof}が既にあります`)
		}
		new_state.focus = {
			src: body_element.movement.src,
			stepped: body_element.movement.stepStyle === "NoStep" ? null : body_element.movement.step,
			actual_final_dest: body_element.movement.secondDest,
			initially_planned_dest: body_element.movement.firstDest
		}
	} else {
		const _: never = body_element;
		throw new Error("Should not reach here: invalid value in body_element.type");
	}
	return new_state;
}

export function getAllStatesFromParsed(parsed: Readonly<Parsed>): State[] {
	if (!parsed.starting_players) {
		throw new Error(`todo: current implementation requires 一位色. 
		To resolve this, I would need to uncomment "ambiguous_alpha" | "ambiguous_beta"
		in State.whose_turn して、皇以外の駒を動かしたらそれを元に逆に辿って解消する、みたいなのを入れる必要がある。`);
	}
	let current_state = getInitialState({
		ia_side: { player_name_short: "張", player_name: "張三" },
		a_side: { player_name_short: "李", player_name: "李四" }
	});
	const ans: State[] = [current_state];
	for (let i = 0; i < parsed.parsed_bodies.length; i++) {
		const next_state = (() => {
			try {
				return getNextState(current_state, parsed.parsed_bodies[i], parsed.starting_players.split("") as HanziColor[])
			} catch (e: any) {
				alert(`${i}ステップ目での${e}`);
				return current_state;
			}
		})();
		if (!next_state) break;
		ans.push(next_state);
		current_state = next_state;
	}
	return ans;
}
