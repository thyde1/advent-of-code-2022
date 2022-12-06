import { input } from "./input";

const containsDuplicateCharacter = (message: string) => {
    for (let char of [...message]) {
        if (message.indexOf(char) !== message.lastIndexOf(char)) {
            return true;
        }
    }
    return false;
};

const isAllUniqueCharacters = (message: string, inputPosition: number, numberOfCharacters: number) => {
    if (inputPosition < numberOfCharacters) {
        return false;
    }

    return !containsDuplicateCharacter(message.slice(inputPosition - numberOfCharacters, inputPosition));
};

const findIndicatorPosition = (message: string, numberOfCharacters: number) => {
    for (let i = numberOfCharacters; i <= message.length; i++) {
        if (isAllUniqueCharacters(message, i, numberOfCharacters)) {
            return i;
        }
    }
}

const findSignalPosition = (message: string) => findIndicatorPosition(message, 4);
const findMessagePosition = (message: string) => findIndicatorPosition(message, 14);

console.log(findSignalPosition(input)); // Answer to part 1

console.log(findMessagePosition(input)); // Answer to part 2
