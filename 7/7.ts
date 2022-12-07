import { input } from "./input";

type File = { name: string, size: number };
type Directory = { name: string, contents: (Directory | File)[], parent?: Directory };

const getCommands = () => input.split("\n");

const getCommandTokens = (command: string) => command.split(" ");

const calcDirectorySize = (fileSystem: Directory): number => {
    var subDirsSize = fileSystem.contents
        .filter(item => (item as File).size === undefined)
        .reduce((t, v) => t += calcDirectorySize(v as Directory), 0);
    var filesSize = fileSystem.contents
        .filter(item => (item as File).size !== undefined)
        .reduce((t, v) => t += (v as File).size, 0);
    return subDirsSize + filesSize;
}

const getFlatDirectoryList = (fileSystem: Directory): Directory[] => {
    var subdirectories = (fileSystem.contents.filter(item => (item as File).size === undefined) as Directory[]);
    return [...subdirectories, ...subdirectories.flatMap(d => getFlatDirectoryList(d))];
}

const getDirectories = () => {
    const commands = getCommands();
    const fileSystem: Directory = { name: "/", contents: [] };
    let cwd: Directory = fileSystem;

    const cd = (operand: string) => {
        switch (operand) {
            case "/":
                cwd = fileSystem;
                break;
            case "..":
                if (cwd.parent === undefined) {
                    throw new Error("Cannot navigate up from root");
                }
                cwd = cwd.parent;
                break;
            default:
                const newCwd = cwd.contents.find(c => c.name === operand);
                if (newCwd === undefined) {
                    throw new Error("Cannot navigate to directory that does not exist");
                }

                cwd = newCwd as Directory;
                break;
        }
    };

    const ls = (commands: string[]) => {
        let i = 0;
        let eol = false;
        while (!eol && i < commands.length) {
            let commandTokens = getCommandTokens(commands[i]);
            if (commandTokens[0] === "$") {
                eol = true;
            }
            else
            {
                if (commandTokens[0] === "dir") {
                    cwd.contents.push({ name: commandTokens[1], contents: [], parent: cwd })
                }
                else
                {
                    cwd.contents.push({ size: parseInt(commandTokens[0]), name: commandTokens[1]});
                }
            }
            
            i++;
        }
    };


    commands.forEach((command, commandIndex) => {
        const tokens = getCommandTokens(command);
        if (tokens[0] !== "$") {
            return;
        }

        switch (tokens[1]) {
            case "cd":
                cd(tokens[2]);
                break;
            case "ls":
                commands.slice(1);
                ls(commands.slice(commandIndex + 1));
                break;
        }
    });

    return fileSystem;
};

var fileSystem = getDirectories();
var directoryList = getFlatDirectoryList(fileSystem);
var directoriesAndSizes = directoryList.map(d => ({ name: d.name, size: calcDirectorySize(d) }));
var directoriesUnderThresholdTotalSize = directoriesAndSizes
    .filter(d => d.size <= 100000)
    .reduce((t, v) => t += v.size, 0);

console.log(directoriesUnderThresholdTotalSize); // Answer to part 1

const totalDiskSize = 70000000;
const toFree = 30000000 - (totalDiskSize - calcDirectorySize(fileSystem));
directoriesAndSizes.sort((a, b) => a.size - b.size);

console.log(directoriesAndSizes.find(d => d.size >= toFree)?.size); // Answer to part 2
