import { input } from "./input";

type Instruction = {
    count: number;
    from: number;
    to: number;
};

const sections = input.split("\n\n");
const rows = sections[0].split("\n").slice(0, -1);

const getStacks = () => {
    const stacks: string[][] = []
    for (let i = 1, j = 0; i < rows[0].length; i += 4, j++) {
        stacks[j] = [];
        for (let row = 0; row < rows.length; row++) {
            const value = rows[row][i];
            if (value !== " ") {
                stacks[j][row] = value;
            }
        }

        stacks[j] = stacks[j].reverse().filter(x => x !== " ");
    }
    return stacks;
}

const instructions: Instruction[] = sections[1]
    .split("\n")
    .map(row => row.split(" ")
        .filter(v => !["move", "from", "to"].includes(v))
        .map(v => parseInt(v))
    ).map(i => ({ count: i[0], from: i[1] - 1, to: i[2] - 1 }));

const performInstructionIteration = (instruction: Omit<Instruction, "count">, stacks: string[][]) => {
    let crate = stacks[instruction.from].pop();
    crate && stacks[instruction.to].push(crate);
    return stacks;
}

const performInstruction = (instruction: Instruction, stacks: string[][]) => {
    for (let i = 0; i < instruction.count; i ++) {
        stacks = performInstructionIteration({ from: instruction.from, to: instruction.to}, stacks);
    }
    return stacks;
};

const getTopValues = (stacks: string[][]) => stacks.map(stack => stack[stack.length - 1]);

let stacks = getStacks();
instructions.forEach(instruction => {
    stacks = performInstruction(instruction, stacks);
});

console.log(getTopValues(stacks).join("")); // Answer to part 1

const performStackInstruction = (instruction: Instruction, stacks: string[][]) => {
    const crates = stacks[instruction.from].splice(stacks[instruction.from].length - instruction.count, instruction.count);
    stacks[instruction.to].push(...crates);
    return stacks;
};

stacks = getStacks();

instructions.forEach(instruction => {
    stacks = performStackInstruction(instruction, stacks);
})

console.log(getTopValues(stacks).join("")); // Answer to part 2
