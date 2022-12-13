import { input } from "./input";

type ListItem = (ListItem | number)[] | number;

type Pair = { left: ListItem, right: ListItem };

const parseList = (list: string) => JSON.parse(list) as ListItem[];

const getPairs = (input: string): Pair[] => input.split("\n\n").map(pair => {
    const [left, right] = pair.split("\n").map(list => parseList(list));
    return { left, right };
});

const isOrderCorrect = (pair: Pair): boolean | undefined => {
    const { left, right } = pair;

    if (left === undefined && right === undefined) {
        return undefined;
    }
    if (left === undefined && right !== undefined) {
        return true;
    }

    if (left !== undefined && right === undefined) {
        return false;
    }

    if (typeof left === "number" && typeof right === "number") {
        if (left < right) {
            return true;
        }

        if (left > right) {
            return false;
        }

        return undefined;
    }

    if (typeof left !== "number" && typeof right !== "number") {
        if (left.length === 0 && right.length === 0) {
            return undefined;
        }

        const listComparisonResult = isOrderCorrect({ left: left[0], right: right[0] });
        if (listComparisonResult !== undefined) {
            return listComparisonResult;
        }

        return isOrderCorrect({ left: left.slice(1), right: right.slice(1) });
    }

    if (typeof left === "number" && typeof right !== "number") {
        return isOrderCorrect({ left: [left], right: right });
    }
    
    if (typeof left !== "number" && typeof right === "number") {
        return isOrderCorrect({ left: pair.left, right: [right] });
    }
}

const pairs = getPairs(input);
const checkResults = pairs.map((p, i) => ({ index: i + 1, correct: isOrderCorrect(p) }));
console.log(checkResults.reduce((t, v) => t += v.correct ? v.index : 0, 0)); // Answer to part 1

const dividers = [[[2]], [[6]]];
const packets = [...getPairs(input).flatMap(pair => [pair.left, pair.right]), ...dividers];

packets.sort((a, b) => isOrderCorrect({ left: a, right: b }) ? -1 : 1);
console.log((packets.indexOf(dividers[0]) + 1) * (packets.indexOf(dividers[1]) + 1)); // Answer to part 2
