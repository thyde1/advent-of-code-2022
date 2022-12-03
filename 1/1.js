const inputs = require("./input.js").input;

const elfInvs =  inputs.split("\n\n").map(inv => inv.split("\n").filter(i => !!i));
const elfTotals = elfInvs.map(inv => inv.reduce((t, v) => t += parseInt(v), 0));


console.log(Math.max(...elfTotals));

const sortedTotals = elfTotals.sort((a, b) => b - a);
console.log(sortedTotals.slice(0, 3).reduce((t, v) => t += v, 0));