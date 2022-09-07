import { AbsoluteColumn, AbsoluteRow } from "cerke_online_api";

export type HanziProfession = "船" | "無" | "兵" | "弓" | "車" | "虎" | "馬" | "筆" | "巫" | "将" | "王";
export type HanziProfessionAndTam = HanziProfession | "皇";

export const profs: HanziProfessionAndTam[] = [
	"船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];

export type Board = { [key in AbsoluteColumn]?: { [key in AbsoluteRow]?: NonTamPiece | "皇" } };

export type HanziSeason = "春" | "夏" | "秋" | "冬";
export type Rate = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export type State = {
	season: HanziSeason,
	turn: number,
	rate: Rate,
	focus: [AbsoluteColumn, AbsoluteRow],
	board: Board,
	ia_side: {
		player_name_short: string,
		hop1zuo1: NonTamPiece[],
		player_name: string
	},
	a_side: {
		player_name_short: string,
		player_name: string,
		hop1zuo1: NonTamPiece[]
	}
}

export type NonTamPiece = { color: "赤" | "黒", prof: HanziProfession, is_aside: boolean };
