const input = require("./input.js").input;

const pairs = input
    .split("\n")
    .map(row => row
        .split(",")
        .map(range => range.split("-"))
        .map(range => ({ start: parseInt(range[0]), end: parseInt(range[1]) })));

const fullyContains = (a, b) => (a.start <= b.start && a.end >= b.end);
const eitherFullyContains = (a, b) => fullyContains(a, b) || fullyContains(b, a);

console.log(pairs.filter(p => eitherFullyContains(...p)).length); // Answer to part 1

const getRange = (x) => {
    const range = [];
    for (let i = x.start; i <= x.end; i++) {
        range.push(i);
    }
    return range;
}

const anyOverlap = (a, b) => {
    const rangeA = getRange(a);
    const rangeB = getRange(b);
    return (rangeA.some(x => rangeB.includes(x)));
}

console.log(pairs.filter(pair => anyOverlap(...pair)).length); // Answer to part 2
