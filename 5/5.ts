import { input } from "./input";

type Instruction = {
    count: number;
    from: number;
    to: number;
};

const stacks = input.split("\n\n");
const rows = stacks[0].split("\n").slice(0, -1);
const getRowContents = (row: string) => {
    let i = 1;
    const rowContents: string[] = [];
    for (let i = 1; i < row.length; i += 4) {
        rowContents.push(row[i]);
    }
    return rowContents;
}

const instructions: Instruction[] = stacks[1]
    .split("\n")
    .map(row => row.split(" ")
        .filter(v => !["move", "from", "to"].includes(v))
        .map(v => parseInt(v))
    ).map(i => ({ count: i[0], from: i[1] - 1, to: i[2] - 1 }));

const performInstructionIteration = (instruction: Omit<Instruction, "count">, rows: string[][]) => {
    let crate: string | null = null;
    for (let i = 0; crate === null; i++)
    {
        if (rows[i][instruction.from] !== " ") {
            crate = rows[i][instruction.from];
            rows[i][instruction.from] = " ";
        }
    }

    for (let i = rows.length - 1, placed = false; !placed; i--)
    {
        if (i === -1) {
            rows = [Array(rows[0].length).fill(" ", 0, rows[0].length), ...rows]; // Add a new row at the top
            rows[0][instruction.to] = crate;
            placed = true;
        }

        if (i > -1 && rows[i][instruction.to] === " ") {
            rows[i][instruction.to] = crate;
            placed = true;
        }
    }
    return rows.filter(r => r.some(item => item !== " "));
}

const performInstruction = (instruction: Instruction, rows: string[][]) => {
    for (let i = 0; i < instruction.count; i ++) {
        rows = performInstructionIteration({ from: instruction.from, to: instruction.to}, rows);
    }
    return rows;
};

const formatStacks = (rows: string[][]) => {
    const valueRows = rows.map(row => row.map(i => i === " " ? "   " : `[${i}]`).join(" ")).join("\n");
    return `${valueRows}\n${Array(rows[0].length).fill(" ").map((_, i) => ` ${i + 1} `).join(" ")}`;
}

const getTopValues = (rows: string[][]) => {
    const topValues: string[] = [];
    for (let column = 0; column < rows[0].length; column++) {
        for (let row = 0, found = false; !found; row++) {
            if (rows[row][column] != " ") {
                found = true;
                topValues[column] = rows[row][column];
            }
        }
    }
    return topValues;
}

let rowContents = rows.map(getRowContents);

instructions.forEach(instruction => {
    rowContents = performInstruction(instruction, rowContents);
});

console.log(getTopValues(rowContents).join("")); // Answer to part 1

const performStackInstruction = (instruction: Instruction, rows: string[][]) => {
    let crates: string[] = [];
    for (let i = 0; crates.length === 0; i++)
    {
        if (rows[i][instruction.from] !== " ") {
            for (let row = i; row < i + instruction.count; row++) {
                crates[row - i] = rows[row][instruction.from];
                rows[row][instruction.from] = " ";
            }
        }
    }

    for (let crateIndex = crates.length - 1; crateIndex >= 0; crateIndex--) {
        for (let i = rows.length - 1, placed = false; !placed; i--) {
            if (i === -1) {
                rows = [Array(rows[0].length).fill(" ", 0, rows[0].length), ...rows]; // Add a new row at the top
                rows[0][instruction.to] = crates[crateIndex];
                placed = true;
            }

            if (i > -1 && rows[i][instruction.to] === " ") {
                rows[i][instruction.to] = crates[crateIndex];
                placed = true;
            }
        }
    }
    return rows.filter(r => r.some(item => item !== " "));
}

rowContents = rows.map(getRowContents);

instructions.forEach(instruction => {
    rowContents = performStackInstruction(instruction, rowContents);
})

console.log(getTopValues(rowContents).join("")); // Answer to part 2
