import { input } from "./input";

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
    const eligibleValves = valves.filter(v => v.flowRate > 0 && v.distances[startingValve.id] < time);

    if (eligibleValves.length <= 1) {
        return [eligibleValves];
    }

    return eligibleValves.flatMap(v =>
        getPermutations(
            valves.filter(e => e !== v),
            time - v.distances[startingValve.id] - 1,
            v
        ).map(p => [v, ...p])
    );
}

const getPermutationPressureReleased = (startingValveId: string, valves: ValveWithDistances[], time: number) => {
    let pressureReleased = 0;
    valves.forEach((v, i) => {
        time -= valves[i - 1]?.distances[v.id] || v.distances[startingValveId];
        time --;
        pressureReleased += v.flowRate * time;
    });

    return pressureReleased;
};
    
const valves = getDistancesToOtherValves(getValves(input));
const startingValveId = "AA";
const possiblePermutations = getPermutations(valves, 30, valves.find(v => v.id === startingValveId) as ValveWithDistances);

const bestPermutation = possiblePermutations.map(p => (
    { perm: p, pressure: getPermutationPressureReleased(startingValveId, p, 30) })
    ).sort((a, b) => b.pressure - a.pressure)[0];

console.log(bestPermutation.pressure); // Answer to part 1
