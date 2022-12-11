import { input } from "./input";

type MonkeyConfig = {
    number: number,
    operator: string,
    operand: string,
    divisor: number,
    divisibleMonkey: number,
    indivisibleMonkey: number
}

type MonkeyConfigAndInventory = MonkeyConfig & { items: number[] };

const getMonkeysConfig = (input: string): MonkeyConfigAndInventory[] => {
    const monkeysConfig = input.split("\n\n");
    return monkeysConfig.map(monkeyConfig => {
        const configRows = monkeyConfig.split("\n");
        return {
            number: parseInt(configRows[0].replace("Monkey ", "").replace(":", "")),
            items: configRows[1].split(": ")[1].split(", ").map(item => parseInt(item)),
            operator: configRows[2].split(" ")[4],
            operand: configRows[2].split(" ")[5],
            divisor: parseInt(configRows[3].split("by ")[1]),
            divisibleMonkey: parseInt(configRows[4].split("monkey ")[1]),
            indivisibleMonkey: parseInt(configRows[5].split("monkey ")[1])
        };
    });
}

const numberWitAllCommonFactors = getMonkeysConfig(input).map(m => m.divisor).reduce((t, v) => t * v, 1);

const inspectItem = (item: number, monkeyConfig: MonkeyConfig, worryLevelDivisor: number) => {
    let newWorryLevel = item;
    let operand = monkeyConfig.operand === "old" ? item : parseInt(monkeyConfig.operand);
    switch (monkeyConfig.operator) {
        case "+":
            newWorryLevel = item + operand;
            break;
        case "*":
            newWorryLevel = item * operand;
            break;
        default:
            throw new Error(`Unexpected operator ${monkeyConfig.operator}`);
    }

    newWorryLevel = Math.floor(newWorryLevel / worryLevelDivisor);
    newWorryLevel = newWorryLevel % numberWitAllCommonFactors; 
    const nextMonkey = newWorryLevel % monkeyConfig.divisor === 0 ?
        monkeyConfig.divisibleMonkey : monkeyConfig.indivisibleMonkey;
    return { newWorryLevel, nextMonkey };
}

const doRound = (monkeys: MonkeyConfigAndInventory[], worryLevelDivisor: number) => {
    const inpsectionCounts: { monkeyNumber: number, count: number }[] = [];
    for (const monkey of monkeys) {
        inpsectionCounts.push({ monkeyNumber: monkey.number, count: monkey.items.length });
        for (const item of monkey.items) {
            const { newWorryLevel, nextMonkey } = inspectItem(item, monkey, worryLevelDivisor);
            monkeys.find(m => m.number === nextMonkey)?.items.push(newWorryLevel);
        }

        monkey.items = [];
    }

    return inpsectionCounts;
}

const getInspectionCountsFromAllRounds = (totalRounds: number, worryLevelDivisor: number) => {
    const monkeys = getMonkeysConfig(input);
    let inspectionCounts: { monkeyNumber: number, count: number }[] =
        monkeys.map(m => ({ monkeyNumber: m.number, count: 0 }));
    for (var i = 0; i < totalRounds; i++) {
        const roundInspectionCounts = doRound(monkeys, worryLevelDivisor);
        inspectionCounts = inspectionCounts.map(i =>
            ({ ...i, count: i.count += (roundInspectionCounts.find(r => r.monkeyNumber === i.monkeyNumber)?.count || 0) }));
    }

    return inspectionCounts;
}

const calculateTotalMonkeyBusiness = (totalRounds: number, worryLevelDivisor: number) => {
    const topInspectors = getInspectionCountsFromAllRounds(totalRounds, worryLevelDivisor)
        .sort((a, b) => b.count - a.count)
        .slice(0, 2);
    return topInspectors.reduce((t, v) => t * v.count, 1);
};

console.log(calculateTotalMonkeyBusiness(20, 3)); // Answer to part 1
console.log(calculateTotalMonkeyBusiness(10000, 1)); // Answer to part 2
