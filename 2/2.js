const inputs = require("./input.js").input.split("\n").filter(i => !!i).map(i => i.split(" "));

const getShapePoints = (a) => a.charCodeAt(0) - 87; // char code of "X" === 88

const getSymbol = (a) => String.fromCharCode(a.charCodeAt(0) + 23);

const getWinner = (a, b) => {
    const diff = getSymbol(a).charCodeAt(0) - b.charCodeAt(0);
    switch (diff) {
        case 1:
        case -2:
            return "a";
        case 0:
            return "draw";
        case -1:
        case 2:
            return "b";
    }
};

const getWinPoints = (a, b) => {
    switch (getWinner(a, b)) {
        case "a": return 0;
        case "b": return 6;
        case "draw": return 3;
    }
};

const getTotalPoints = (a, b) => getShapePoints(b) + getWinPoints(a, b);

console.log(inputs.reduce((t, v) => t += getTotalPoints(...v), 0)); // Answer to part 1

const getDesiredWinner = (b) => {
    switch (b) {
        case "X": return "a";
        case "Y": return "draw";
        case "Z": return "b";
    }
}
const getChoice = (a, b) => [..."XYZ"].find(v => getWinner(a, v) === getDesiredWinner(b));

console.log(inputs.reduce((t, v) => t += getTotalPoints(v[0], getChoice(...v)), 0)); // Answer to part 2
