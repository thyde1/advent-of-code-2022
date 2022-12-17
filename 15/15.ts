import { input } from "./input";

type Coords = { x: number, y: number };

type MapInfo = { sensorCoords: Coords, beaconCoords: Coords }[];

type Range = { start: number, end: number };

const getInputInfo = (input: string): MapInfo => {
    return input.split("\n").map(line => {
        const sensorCoordsString = line.split("Sensor at ")[1].split(":")[0].split(", ");
        const parseCoordsString = (coordsString: string) => parseInt(coordsString.slice(2));
        const sensorCoords = { x: parseCoordsString(sensorCoordsString[0]), y: parseCoordsString(sensorCoordsString[1]) };
        const beaconCoordsString = line.split("is at ")[1].split(", ");
        const beaconCoords = { x: parseCoordsString(beaconCoordsString[0]), y: parseCoordsString(beaconCoordsString[1]) };
        return { sensorCoords, beaconCoords };
    });
};

const getDistance = (a: Coords, b: Coords) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getDefinitelyClearInRow = (row: number, map: MapInfo, beaconsAreClear: boolean, maxCoord: number | undefined = undefined) => {
    let clear: { [position: number]: boolean } = {};
    for (const sensor of map) {
        const yDiff = Math.abs(sensor.sensorCoords.y - row);
        const distanceFromBeacon = getDistance(sensor.sensorCoords, sensor.beaconCoords);
        const unadjustedMaxXdiff = distanceFromBeacon - yDiff;
        if (unadjustedMaxXdiff <= 0) {
            continue;
        }

        const maxXDiff = Math.floor(unadjustedMaxXdiff);
        const unadjustedXMin = sensor.sensorCoords.x - maxXDiff;
        const unadjustedXMax = sensor.sensorCoords.x + maxXDiff;
        const xMin = maxCoord ? Math.max(Math.min(maxCoord, unadjustedXMin), 0) : unadjustedXMin;
        const xMax = maxCoord ? Math.min(Math.max(0, unadjustedXMax), maxCoord) : unadjustedXMax;
        for (let x = xMin; x <= xMax; x++) {
            clear[x] = true;
        }
    }
    
    if (beaconsAreClear) {
        for (const beacon of map.filter(m => m.beaconCoords.y === row).map(m => m.beaconCoords)) {
            delete clear[beacon.x];
        }
    }

    return Object.keys(clear).map(key => parseInt(key));
}

const getDefinitelyClearInRowRanges = (row: number, map: MapInfo, maxCoord: number) => {
    const clearRanges: { start: number, end: number }[] = []
    for (const sensor of map) {
        const yDiff = Math.abs(sensor.sensorCoords.y - row);
        const distanceFromBeacon = getDistance(sensor.sensorCoords, sensor.beaconCoords);
        const unadjustedMaxXdiff = distanceFromBeacon - yDiff;
        if (unadjustedMaxXdiff <= 0) {
            continue;
        }

        const maxXDiff = Math.floor(unadjustedMaxXdiff);
        const unadjustedXMin = sensor.sensorCoords.x - maxXDiff;
        const unadjustedXMax = sensor.sensorCoords.x + maxXDiff;
        const xMin = Math.max(Math.min(maxCoord, unadjustedXMin), 0);
        const xMax = Math.min(Math.max(0, unadjustedXMax), maxCoord);
        clearRanges.push({ start: xMin, end: xMax });
    }

    return clearRanges;
}

const mapInfo = getInputInfo(input);
console.log(Object.keys(getDefinitelyClearInRow(2000000, mapInfo, true)).length); // Answer to part 1

const doesRangeCoverAll = (ranges: Range[], maxCoord: number) => {
    if (ranges.find(r => r.start === 0 && r.end === maxCoord)) {
        return true;
    }

    const firstRange = ranges.find(r => r.start === 0);
    if (!firstRange) {
        return false;
    }

    const wholeRange = { ...firstRange };
    let extended = true;
    while (extended) {
        const extendingRange = ranges.find(r => r.start <= wholeRange.end && r.end > wholeRange.end);
        if (extendingRange) {
            wholeRange.end = extendingRange.end;
        }
        else
        {
            extended = false;
        }
    }

    return wholeRange.end === maxCoord;
};

const getDistressLocation = (map: MapInfo, maxCoord: number) => {
    let distressRow: number | null = null;
    for (let row = 0; row <= maxCoord && distressRow === null; row++) {
        const impossibleXRanges = getDefinitelyClearInRowRanges(row, map, maxCoord);
        if (!doesRangeCoverAll(impossibleXRanges, maxCoord)) {
            distressRow = row;
        }
    }

    if (distressRow === null) {
        throw new Error("We should always find a distress location");
    }

    const clearSpaces = getDefinitelyClearInRow(distressRow, map, false, maxCoord);
    const clearSpacesKeyValues = clearSpaces.map(s => ({ [s]: true }));
    const clearSpacesObject: { [x: number]: boolean } = {};
    for (let i = 0; i < clearSpacesKeyValues.length; i++) {
        Object.assign(clearSpacesObject, clearSpacesKeyValues[i]);
    }

    for (let i = 0; i <= maxCoord; i++) {
        if (!clearSpacesObject[i]) {
            return { x: i, y: distressRow };
        }
    }

    throw new Error("We should always find a distress location");
}

const getTuningFrequency = (map: MapInfo, maxCoord: number) => {
    const { x, y } = getDistressLocation(map, maxCoord);
    return x * 4000000 + y;
}

console.log(getTuningFrequency(mapInfo, 4000000)); // Answer to part 2
