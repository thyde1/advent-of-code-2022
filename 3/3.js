const input = require("./input.js").input;
// const input = `vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw`;

const sacks = input.split("\n").map(sack => [sack.slice(0, sack.length / 2), sack.slice(sack.length / 2, sack.length)]);
const getPriority = (x) => { 
    const code = x.charCodeAt(0);
    return code >= 97 ? code - 96 : code - 38;
};

const getDupe = (x, y, z) => {
    return [...x].find(i => [...y].includes(i) && (z === undefined || [...z].includes(i)));
};

console.log(sacks.reduce((t, v) => t += getPriority(getDupe(...v)), 0));

const sackGroups = sacks.reduce((t, v, i) => {
    const groupNo = Math.floor(i / 3);
    if (t[groupNo] === undefined) t[groupNo] = [];
    t[groupNo].push(v.join(""));
    return t;
}, []);

console.log(sackGroups.map(g => getDupe(...g)).reduce((t, v) => t += getPriority(v), 0));
