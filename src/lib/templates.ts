import type { BoardType } from "./board";

export interface Template {
  name: string;
  cells: BoardType;
}

export const templates: Template[] = [
  {
    name: "Glider",
    cells: [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
    ],
  },
  {
    name: "Square",
    cells: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: "Blinker",
    cells: [[1], [1], [1]],
  },
];
