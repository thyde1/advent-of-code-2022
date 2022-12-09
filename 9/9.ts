import { input } from "./input";

type Position = { x: number, y: number};

const getDirections = (instructions: string) => {
    const lines = instructions.split("\n");
    const directionsAndCounts = lines.map(line => {
        const [direction, count] = line.split(" ");
        return { direction, count: parseInt(count) };
    });
    return directionsAndCounts.flatMap(dac => Array<string>(dac.count).fill(dac.direction));
};

const areAdjacent = (headPos: Position, tailPos: Position) => 
    Math.abs(headPos.x - tailPos.x) < 2 && Math.abs(headPos.y - tailPos.y) < 2;

const areInSameColumn = (headPos: Position, tailPos: Position) =>
    headPos.x === tailPos.x;

const areInSameRow = (headPos: Position, tailPos: Position) =>
    headPos.y === tailPos.y;

const calcHeadPos = (headPos: Position, direction: string) => {
    switch (direction) {
        case "U":
            return { ...headPos, y: headPos.y + 1 };
        case "R":
            return { ...headPos, x: headPos.x + 1 };
        case "D":
            return { ...headPos, y: headPos.y - 1 };
        case "L":
            return { ...headPos, x: headPos.x - 1 };
        default:
            return headPos;
    }
};

const calcTailPos = (headPos: Position, tailPos: Position) => {
    if (areAdjacent(headPos, tailPos)) {
        return tailPos;
    }

    let xPos: number = tailPos.x;
    let yPos: number = tailPos.y;

    if (!areInSameRow(headPos, tailPos)) {
        yPos = headPos.y > tailPos.y ? tailPos.y + 1 : tailPos.y - 1;
    }
    
    if (!areInSameColumn(headPos, tailPos)) {
        xPos = headPos.x > tailPos.x ? tailPos.x + 1 : tailPos.x - 1;
    }

    return { x: xPos, y: yPos };
}

let headPosition = { x: 0, y: 0 };
let tailPosition = { x: 0, y: 0 };
let pastTailPositions = [tailPosition];
let directions = getDirections(input);
for (const direction of directions) {
    headPosition = calcHeadPos(headPosition, direction);
    tailPosition = calcTailPos(headPosition, tailPosition);
    if (!pastTailPositions.find(p => tailPosition.x === p.x && tailPosition.y === p.y)) {
        pastTailPositions.push(tailPosition);
    }
}

console.log(pastTailPositions.length); // Answer to part 1

const positions = Array<Position>(10).fill({x: 0, y: 0});
pastTailPositions = [positions[positions.length - 1]];
directions = getDirections(input);
for (const direction of directions) {
    positions[0] = calcHeadPos(positions[0], direction);
    for (let i = 1; i < positions.length; i++) {
        positions[i] = calcTailPos(positions[i - 1], positions[i]);
    }

    tailPosition = positions[positions.length - 1];
    if (!pastTailPositions.find(p => tailPosition.x === p.x && tailPosition.y === p.y)) {
        pastTailPositions.push(tailPosition);
    }
}

console.log(pastTailPositions.length); // Answer to part 2
