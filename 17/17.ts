import { input } from "./input";

type Jet = "<" | ">";

const rockPatterns = [
    [{ x: 2, y: 0 }, { x: 3, y: 0}, { x: 4, y: 0 }, { x: 5, y: 0 }],
    [{ x: 3, y: 0 }, { x: 2, y: 1}, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 2 }],
    [{ x: 2, y: 0 }, { x: 3, y: 0}, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1}, { x: 2, y: 2 }, { x: 2, y: 3 }],
    [{ x: 2, y: 0 }, { x: 3, y: 0}, { x: 2, y: 1 }, { x: 3, y: 1 }],
];

const jets: Jet[] = [...input] as Jet[];

const simulateRockFall =
    (rockPatternIndex: number, cave: boolean[][], caveWidth: number, jets: Jet[], counter: number): number => {
    const caveTop = cave.length - 1;
    const rock = [...rockPatterns[rockPatternIndex].map(p => ({ ...p }))];
    for (const position of rock) {
        position.y = position.y + caveTop + 4;
    }

    let landed = false;
    while (!landed) {
        const jetDirection = jets[counter % jets.length] === "<" ? -1 : 1;
        console.log(jetDirection);
        if (!rock.some(r => cave[r.y]?.[r.x + jetDirection] || r.x + jetDirection < 0 || r.x + jetDirection >= caveWidth)) {
            rock.forEach(p => p.x += jetDirection);
        }

        if (rock.some(r => cave[r.y - 1]?.[r.x] || r.y === 0)) {
            landed = true;
        } else {
            rock.forEach(p => p.y --);
        }

        counter++;
    }

    for (const position of rock) {
        if (cave[position.y] === undefined) {
            cave.push([]);
        }

        cave[position.y][position.x] = true;
    }

    return counter;
};

const drawCave = (cave: boolean[][], caveWidth: number) => {
    let caveString = "";
    for (const row of [...cave].reverse()) {
        caveString += "|";
        for (let x = 0; x < caveWidth; x++) {
            if (row[x]) {
                caveString += "#";
            } else {
                caveString += ".";
            }
        }
        caveString += "|\n";
    }
    caveString += "+";
    for (let x = 0; x < caveWidth; x++) {
        caveString += "-";
    }

    caveString += "+";

    console.log(caveString);
};

const cave: boolean[][] = [];

let counter = 0;
for (let i = 0; i < 2022; i ++) {
    counter = simulateRockFall(i % rockPatterns.length, cave, 7, jets, counter);
}

drawCave(cave, 7);

console.log(cave.length);
