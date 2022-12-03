const inputs = require("./input.js").input.split("\n").filter(i => !!i).map(i => i.split(" "));

const getShapePoints = (a, b) => {
    switch (b) {
        case "X":
            return 1;
        case "Y":
            return 2;
        case "Z":
            return 3;
    }
}

const getWinPoints = (a, b) => {
    switch (a) {
        case "A":
            switch (b) {
                case "X": return 3;
                case "Y": return 6;
                case "Z": return 0;
            }
        case "B":
            switch (b) {
                case "X": return 0;
                case "Y": return 3;
                case "Z": return 6;
            }
        case "C":
            switch (b) {
                case "X": return 6;
                case "Y": return 0;
                case "Z": return 3;
            }
    }
}

const getTotalPoints = (a, b) => getShapePoints(a, b) + getWinPoints(a, b);

const sample = [["A", "Y"], ["B", "X"], ["C", "Z"]];
console.log(inputs.reduce((t, v) => t += getTotalPoints(...v), 0));

const getChoice = (a, b) => {
    switch (a) {
        case "A":
            switch (b) {
                case "X": return "Z";
                case "Y": return "X";
                case "Z": return "Y";
            }
        case "B":
            switch (b) {
                case "X": return "X";
                case "Y": return "Y";
                case "Z": return "Z";
            }
        case "C":
            switch (b) {
                case "X": return "Y";
                case "Y": return "Z";
                case "Z": return "X";
            }
    }
}

console.log(inputs.reduce((t, v) => t += getTotalPoints(v[0], getChoice(...v)), 0));
