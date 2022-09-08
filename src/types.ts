import { AbsoluteColumn, AbsoluteRow, AbsoluteCoord, Color, Profession, Season } from "cerke_online_api";

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
export function fromHanziSeason(s: HanziSeason): Season {
	if (s === "春") return 0; 
	else if (s === "夏") return 1;
	else if (s === "秋") return 2;
	else if (s === "冬") return 3;
	throw new Error(`Should not reach here: Unexpected season ${s}`)
}

export type Rate = 1 | 2 | 4 | 8 | 16 | 32 | 64;
export type HanziColor = "赤" | "黒";
export function toHanziColor(c: Color): HanziColor {
	if (c === Color.Kok1) return "赤";
	return "黒";
}
export function toHanziProfession(p: Profession): HanziProfession {
	if (p === Profession.Dau2) return "虎";
	if (p === Profession.Gua2) return "弓";
	if (p === Profession.Io) return "王";
	if (p === Profession.Kauk2) return "兵";
	if (p === Profession.Kaun1) return "車";
	if (p === Profession.Kua2) return "筆";
	if (p === Profession.Maun1) return "馬";
	if (p === Profession.Nuak1) return "船";
	if (p === Profession.Tuk2) return "巫";
	if (p === Profession.Uai1) return "将";
	throw new Error(`Should not reach here: Unexpected profession ${p}`)
}
export type State = {
	season: HanziSeason,
	turn: number,
	whose_turn: "ia_side" | "a_side" /*| "ambiguous_alpha" | "ambiguous_beta"*/ | null,
	rate: Rate,
	focus: {
		actual_dest: AbsoluteCoord | null,
		stepped: AbsoluteCoord | null,
		src: AbsoluteCoord | null | "ia_side_hop1zuo1" | "a_side_hop1zuo1",
		planned_dest: AbsoluteCoord | null
	},
	board: Board,
	ia_side: {
		player_name_short: string,
		hop1zuo1: { color: HanziColor, prof: HanziProfession, is_aside: false }[],
		player_name: string,
		score: number,
		is_newly_acquired: boolean,
	},
	a_side: {
		player_name_short: string,
		player_name: string,
		hop1zuo1: { color: HanziColor, prof: HanziProfession, is_aside: true }[],
		score: number,
		is_newly_acquired: boolean,
	}
}

export type NonTamPiece = { color: HanziColor, prof: HanziProfession, is_aside: boolean };
