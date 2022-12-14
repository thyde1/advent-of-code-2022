import { input } from "./input";

type Position = { x: number, y: number };

type CavePoint = Position & { type: "rock" | "sand" };
type Cave = ("rock" | "sand" | undefined)[][];

const getLineRockPositions = (line: Position[]): Position[] => {
    const positions: Position[] = [];
    for (let i = 0; i < line.length - 1; i++) {
        const [start, end] = line.slice(i, i + 2);
        const differingCoordinate = start.x !== end.x ? "x" : "y";
        const lineDirection = start[differingCoordinate] > end[differingCoordinate] ? -1 : 1;
        for (let pos = start[differingCoordinate]; pos !== end[differingCoordinate]; pos += lineDirection) {
            positions.push({ ...start, [differingCoordinate]: pos });
        }

        positions.push(line[i + 1]);
    }

    return positions;
};

const getRockPositions = (input: string) => {
    const lines = input
        .split("\n")
        .map(line => line.split(" -> "))
        .map(line => line.map(l => {
            const [x, y] = l.split(",").map(c => parseInt(c));
            return { x, y };
        }));
    const rockPositions: Position[] = [];
    
    for (const line of lines) {
        rockPositions.push(...getLineRockPositions(line));
    }

    return rockPositions;
};

const drawCave = (rockPositions: CavePoint[]) => {
    const orderedXPositions = rockPositions.map(p => p.x).sort((a, b) => a - b);
    const xMin = orderedXPositions[0];
    const xMax = orderedXPositions[orderedXPositions.length - 1];
    const orderedYPositions = rockPositions.map(p => p.y).sort((a, b) => a - b);
    const yMax = orderedYPositions[orderedXPositions.length - 1];
    let caveString = "";
    for (let y = 0; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
            if (x === 500 && y === 0) {
                caveString += "+";
            } else {
                const type = rockPositions.find(p => p.x === x && p.y === y)?.type;
                switch (type) {
                    case "rock":
                        caveString += "#";
                        break;
                    case "sand":
                        caveString += "o";
                        break;
                    default:
                        caveString += ".";
                        break;
                }
            }
        }
        caveString += "\n";
    }

    console.log(caveString);
};

const isSolid = (cave: CavePoint[], x: number, y: number) => {
    return !!cave.find(p => p.x === x && p.y === y);
}

const simulateSandDrop = (cave: CavePoint[]) => {
    let sandPos = { x: 500, y: 0 };
    const yMax = cave.map(p => p.y).sort((a, b) => b - a)[0];
    while (true) {
        if (sandPos.y > yMax) {
            return { atRest: false };
        }

        if (!isSolid(cave, sandPos.x, sandPos.y + 1)) {
            sandPos = { x: sandPos.x, y: sandPos.y + 1 };
            continue;
        }

        if (!isSolid(cave, sandPos.x - 1, sandPos.y + 1)) {
            sandPos = { x: sandPos.x - 1, y: sandPos.y + 1 };
            continue;
        }

        if (!isSolid(cave, sandPos.x + 1, sandPos.y + 1)) {
            sandPos = { x: sandPos.x + 1, y: sandPos.y + 1 };
            continue;
        }
        
        cave.push({ ...sandPos, type: "sand" });
        return { atRest: true };
    }
}

const rockPositions = getRockPositions(input);
const cavePoints: CavePoint[] = rockPositions.map(p => ({ ...p, type: "rock" }));

let grains = 0;
while (simulateSandDrop(cavePoints).atRest === true) {
    grains++;
    console.log(grains);
    drawCave(cavePoints);
}

drawCave(cavePoints);
console.log(grains);
