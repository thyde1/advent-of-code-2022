import { input } from "./input";

type MapSquare = { isStart: boolean, isGoal: boolean, height: number, distanceToGoal?: number };

class Map {
    constructor(squares: MapSquare[][]) {
        this.squares = squares;
    }

    private squares: MapSquare[][];

    public getSquare(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.getSize().x || y >= this.getSize().y) {
            return undefined;
        }
        return this.squares[y][x]
    };

    public getSize() {
        return { x: this.squares[0].length, y: this.squares.length };
    }

    public getAllSquares() {
        return this.squares.flatMap(square => square);
    }
}

const getMap = (input: string): Map => {
    return new Map(input.split("\n").map(row => [...row].map(height => {
        let squareHeight: number;
        switch (height) {
            case "S":
                squareHeight = 0;
                break;
            case "E":
                squareHeight = 25;
                break;
            default:
                squareHeight = height.charCodeAt(0) - 97;
                break;
        }
        return { isStart: height === "S", isGoal: height === "E", height: squareHeight }
    })));
};

const isMoveAvailable = (from?: MapSquare, to?: MapSquare) => {
    if (from === undefined || to === undefined) {
        return false;
    }
    if (from === to) {
        return false;
    }
    return from.height >= to.height - 1;
};

const setEndDistance = (map: Map) => {
    const end = map.getAllSquares().find(s => s.isGoal);
    if (end === undefined) {
        throw new Error("Goal not found");
    }

    end.distanceToGoal = 0;
};

const calculateSquareDistancesRound = (map: Map) => {
    const mapSize = map.getSize();
    let improvedMapping = false;
    for (let x = 0; x < mapSize.x; x++) {
        for (let y = 0; y < mapSize.y; y++) {
            for (const { xOffset, yOffset } of [
                { xOffset: x, yOffset: y - 1 },
                { xOffset: x + 1, yOffset: y },
                { xOffset: x, yOffset: y + 1 },
                { xOffset: x - 1, yOffset: y }
            ]) {
                const from = map.getSquare(x, y);
                const to = map.getSquare(xOffset, yOffset);
                if (from !== undefined &&
                    isMoveAvailable(from, to) &&
                    to?.distanceToGoal !== undefined &&
                    to.distanceToGoal + 1 < (from?.distanceToGoal || Number.MAX_VALUE))
                {
                    from.distanceToGoal = to.distanceToGoal + 1;
                    improvedMapping = true;
                }
            }
        }
    }

    return { improvedMapping };
};

const calculateAllDistances = (map: Map) => {
    setEndDistance(map);
    while (calculateSquareDistancesRound(map).improvedMapping) {}
};

const printMap = (map: Map) => {
    const mapString: string[] = [];
    for (let y = 0; y < map.getSize().y; y++) {
        for (let x = 0; x < map.getSize().x; x ++) {
            mapString.push(`${map.getSquare(x, y)?.distanceToGoal?.toString(10).padStart(2, " 0")} `);
        }
        mapString.push("\n");
    }
    console.log(mapString.join(""));
}

const map = getMap(input);
calculateAllDistances(map);

console.log(map.getAllSquares().find(square => square.isStart === true)?.distanceToGoal); // Answer to part 1
const mostScenicPathLength = 
    map.getAllSquares()
        .filter(square => square.height === 0)
        .map(square => square.distanceToGoal)
        .sort((a, b) => (a || 0) - (b || 0))[0];
console.log(mostScenicPathLength); // Answer to part 2
