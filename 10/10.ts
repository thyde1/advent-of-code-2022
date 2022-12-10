import { input } from "./input";

const getInputs = (inputText: string) => inputText.split("\n").map(line => line.split(" "));

const getChanges = (inputs: string[][]) => {
    const changes: number[] = [];
    for (let input of inputs) {
        switch (input[0]) {
            case "addx":
                changes.push(0, parseInt(input[1]));
                break;
            case "noop":
                changes.push(0);
                break;
        }
    }
    return changes;
};

const getCycleValues = (changes: number[]): number[] => {
    let x = 1;
    const cycleValues: number[] = [];
    for (const change of changes) {
        cycleValues.push(x);
        x += change;
    }
    
    return cycleValues;
};
const getTotalSignalStrengths = () => {
    const changes = getChanges(getInputs(input));
    const cycleValues = getCycleValues(changes);
    const interestingSignals: number[] = [];
    for (let i = 19; i <= 219; i+= 40) {
        interestingSignals.push(cycleValues[i] * (i + 1));
    }

    return interestingSignals.reduce((t, v) => t += v, 0);
};

console.log(getTotalSignalStrengths()); // Answer to part 1

const getImage = () => {
    const changes = getChanges(getInputs(input));
    const cycleValues = getCycleValues(changes);
    const image: string[] = [];
    for (let i = 0; i < cycleValues.length; i++) {
        const drawPosition = (i % 40);
        if (Math.abs(drawPosition - cycleValues[i]) <= 1) {
            image.push("#");
        }
        else
        {
            image.push(".");
        }

        if ((i + 1)  % 40 === 0) {
            image.push("\n");
        }
    }
    return image.join("");
};

console.log(getImage());
