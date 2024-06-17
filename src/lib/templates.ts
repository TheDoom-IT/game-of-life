import type { BoardType } from "./board";

export interface Template {
  name: string;
  cells: BoardType;
}

export interface TemplatesGroup {
  name: string;
  templates: Template[];
}

export const rotateTemplate = (templateCells: BoardType): BoardType => {
  const rows = templateCells.length;
  const columns = templateCells[0].length;

  const result = [];
  for (let i = 0; i < columns; i++) {
    const row = [];
    for (let j = rows - 1; j >= 0; j--) {
      row.push(templateCells[j][i]);
    }
    result.push(row);
  }
  return result;
};

export const templates: TemplatesGroup[] = [
  {
    name: "Static",
    templates: [
      {
        name: "Square",
        cells: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        name: "Loaf",
        cells: [
          [0, 1, 1, 0],
          [1, 0, 0, 1],
          [1, 0, 1, 0],
          [0, 1, 0, 0],
        ],
      },
      {
        name: "Beehive",
        cells: [
          [0, 1, 0],
          [1, 0, 1],
          [1, 0, 1],
          [0, 1, 0],
        ],
      },
    ],
  },
  {
    name: "Oscillators",
    templates: [
      {
        name: "Blinker",
        cells: [[1], [1], [1]],
      },
      {
        name: "Frog",
        cells: [
          [0, 1, 1, 0],
          [1, 0, 0, 0],
          [0, 0, 0, 1],
          [0, 1, 1, 0],
        ],
      },
      {
        name: "Oscillator 1",
        cells: [
          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        ],
      },
    ],
  },
  {
    name: "Spaceships",
    templates: [
      {
        name: "Glider",
        cells: [
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1],
        ],
      },
      {
        name: "Dakota",
        cells: [
          [0, 1, 0, 0, 1],
          [1, 0, 0, 0, 0],
          [1, 0, 0, 0, 1],
          [1, 1, 1, 1, 0],
        ],
      },
    ],
  },
  {
    name: "Guns",
    templates: [
      {
        name: "Gosper Glider Gun",
        cells: [
          [0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 1, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 1, 0, 0],
          [1, 0, 0, 0, 0, 0, 1, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 1, 0, 0],
          [0, 0, 0, 0, 0, 1, 1, 0, 0],
        ],
      },
    ],
  },
];
