import { input } from "./input";

const elfInvs =  input.split("\n\n").map(inv => inv.split("\n").filter(i => !!i));
const elfTotals = elfInvs.map(inv => inv.reduce((t, v) => t += parseInt(v), 0));

console.log(Math.max(...elfTotals)); // Answer to part 1

const sortedTotals = elfTotals.sort((a, b) => b - a);
console.log(sortedTotals.slice(0, 3).reduce((t, v) => t += v, 0)); // Answer to part 2
