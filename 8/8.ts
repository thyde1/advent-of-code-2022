import { input } from "./input";

type Trees = number[][];

const getTrees = (input: string): Trees => input.split("\n").map(row => [...row].map(item => parseInt(item)));

const getColumn = (x: number, trees: Trees) => trees.map(row => row[x]);

const getTreesInAllDirections = (x: number, y: number, trees: Trees) => {
    var column = getColumn(x, trees);
    return [
        trees[y].slice(0, x).reverse(),
        trees[y].slice(x + 1, trees[y].length),
        column.slice(0, y).reverse(),
        column.slice(y + 1, trees.length)
    ];
};

const isVisible = (x: number, y: number, trees: Trees) => {
    const treeHeight = trees[y][x];
    return getTreesInAllDirections(x, y, trees).some(line => line.every(t => t < treeHeight));

};

const countVisible = (trees: Trees) => {
    let count = 0;
    for (let y = 0; y < trees.length; y++) {
        for (let x = 0; x < trees[y].length; x++) {
            count += (isVisible(x, y, trees) ? 1 : 0);
        }
    }
    return count;
};

const trees = getTrees(input);
console.log(countVisible(trees)); // Answer to part 1

const getViewingDistances = (x: number, y: number, trees: Trees) =>
    getTreesInAllDirections(x, y, trees)
        .map(line => { 
            const pos = line.findIndex(t => t >= trees[y][x]);
            return pos === -1 ? line.length : pos + 1
        });

const getScenicScore = (x: number, y: number, trees: Trees) => 
    getViewingDistances(x, y, trees).reduce((t, v) => t * v, 1);

const getScenicScores = (trees: Trees) => {
    const scenicScores: number[] = [];
    for (let y = 0; y < trees.length; y++) {
        for (let x = 0; x < trees[y].length; x++) {
            scenicScores.push(getScenicScore(x, y, trees));
        }
    }
    return scenicScores;
};

console.log(Math.max(...getScenicScores(trees))); // Answer to part 2
