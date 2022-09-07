import { AbsoluteColumn, AbsoluteRow, AbsoluteCoord } from "cerke_online_api";

export type HanziProfession = "船" | "無" | "兵" | "弓" | "車" | "虎" | "馬" | "筆" | "巫" | "将" | "王";
export type HanziProfessionAndTam = HanziProfession | "皇";

export const profs: HanziProfessionAndTam[] = [
	"船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];

export type Board = {
	K: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	L: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	N: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	T: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	Z: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	X: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	C: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	M: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
	P: { [key in AbsoluteRow]?: NonTamPiece | "皇" },
};

export type HanziSeason = "春" | "夏" | "秋" | "冬";
export type Rate = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export type State = {
	season: HanziSeason,
	turn: number,
	rate: Rate,
	focus: AbsoluteCoord | null,
	focus_stepped: AbsoluteCoord | null,
	focus_src: AbsoluteCoord | null, 
	board: Board,
	ia_side: {
		player_name_short: string,
		hop1zuo1: { color: "赤" | "黒", prof: HanziProfession, is_aside: false }[],
		player_name: string,
		score: number,
		is_newly_acquired: boolean,
	},
	a_side: {
		player_name_short: string,
		player_name: string,
		hop1zuo1: { color: "赤" | "黒", prof: HanziProfession, is_aside: true }[],
		score: number,
		is_newly_acquired: boolean,
	}
}

export type NonTamPiece = { color: "赤" | "黒", prof: HanziProfession, is_aside: boolean };
