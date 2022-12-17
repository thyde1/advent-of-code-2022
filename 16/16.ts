import { input } from "./sample";

type Valve = { id: string, flowRate: number, leadsToIds: string[] };

type ValveWithDistances = Valve & { distances: { [valveId: string]: number } };

const getValves = (input: string): Valve[] => {
    const lines = input.split("\n");
    return lines.map(line => {
        const id = line.slice(6, 8);
        const flowRate = parseInt(line.split("rate=")[1].split(";")[0]);
        const leadsToIds = (line.split("valves ")[1] || line.split("valve ")[1]).split(", ");
        return { id, flowRate, leadsToIds };
    });
};

const calculateDistance = (start: string, end: string, valves: Valve[]) => {
    const valvesAndWeights = valves.map(v => ({ ...v, weight: v.id === end ? 0 : Number.MAX_SAFE_INTEGER }));
    const endValve = valvesAndWeights.find(v => v.id === end);
    const startValve = valvesAndWeights.find(v => v.id === start);
    if (!endValve || !startValve) {
        throw new Error("Start or end valve could not be found");
    }

    for (let i = 1; startValve.weight === Number.MAX_SAFE_INTEGER; i ++) {
        const nextHops = valvesAndWeights.filter(v =>
            v.weight === Number.MAX_SAFE_INTEGER &&
            v.leadsToIds.some(l => valvesAndWeights.find(o => o.id === l)?.weight === i - 1));
        for (const valve of nextHops) {
            valve.weight = i;
        }
    }

    return startValve.weight;
};

const getDistancesToOtherValves = (valves: Valve[]): ValveWithDistances[] => {
    return valves.map(v => {
        return { 
            ...v,
            distances: Object.assign({}, ...valves.map(valve => ({ [valve.id]: calculateDistance(v.id, valve.id, valves) })))
        };
    });
}

const getPermutations = (valves: ValveWithDistances[], time: number, startingValve: Valve): ValveWithDistances[][] => {
    const eligibleValves = valves.filter(v => v.flowRate > 0 && v.distances[startingValve.id] < time - 1);

    if (eligibleValves.length === 1) {
        return [eligibleValves];
    }

    return eligibleValves.flatMap(v => 
        getPermutations(
            eligibleValves.filter(e => e !== v),
            time - v.distances[startingValve.id] - 1,
            v
        ).map(p => [v, ...p])
    );
}

const getNextMove = (valves: ValveWithDistances[], currentValve: ValveWithDistances, minutesRemaining: number) => {
    const valvesWithBenefits = valves.map(v => ({
        ...v,
        benefit: (minutesRemaining - currentValve.distances[v.id] - 1) * v.flowRate,
        distance: currentValve.distances[v.id]
    }));

    console.log(valvesWithBenefits.map(v => ({ id: v.id, ben: v.benefit, dist: v.distance })));
    const adjustedValvesWithBenefits = valvesWithBenefits.map(v => ({
        ...v,
        benefit: v.benefit -
            (valvesWithBenefits.filter(o => o.distance < v.distance).sort((a, b) => b.benefit - a.benefit)?.[0]?.benefit || 0)
    }));
    console.log(adjustedValvesWithBenefits.map(v => ({ id: v.id, benefit: v.benefit })));
    return valvesWithBenefits.sort((a, b) => b.benefit - a.benefit)[0];
};

const getPermutationPressureReleased = (startingValveId: string, valves: ValveWithDistances[], time: number) => {
    let pressureReleased = 0;
    valves.forEach((v, i) => {
        time -= valves[i - 1]?.distances[v.id] || v.distances[startingValveId];
        time --;
        console.log(time);
        pressureReleased += v.flowRate * time;
    });

    return pressureReleased;
};
    
const valves = getDistancesToOtherValves(getValves(input));
const startingValveId = "AA";
const possiblePermutations = getPermutations(valves, 30, valves.find(v => v.id === startingValveId) as ValveWithDistances);

console.log(possiblePermutations.length);
const bestPermutation = possiblePermutations.map(p => (
    { perm: p, pressure: getPermutationPressureReleased(startingValveId, p, 30) })
).sort((a, b) => b.pressure - a.pressure)[0];

console.log("BEST!", bestPermutation.pressure);
getPermutationPressureReleased(startingValveId, bestPermutation.perm, 30);
