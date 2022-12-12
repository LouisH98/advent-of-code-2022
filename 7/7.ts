const input = await Deno.readTextFile("input.txt");

interface File {
  name: string;
  size: number;
}

class Directory {
  name: string;
  files: File[];
  directories: Directory[];
  parentDirectory: Directory | undefined;

  constructor(name: string, parentDirectory?: Directory) {
    this.name = name;
    this.files = [];
    this.directories = [];
    this.parentDirectory = parentDirectory;
  }

  get size() {
    return this.calculateSize();
  }

  addFile(file: File) {
    if (!this.files.some((f) => f.name === file.name)) {
      this.files.push(file);
    }
  }

  addDirectory(directory: Directory) {
    const doesDirectoryExist = this.directories.some(
      (d) => d.name === directory.name
    );

    if (!doesDirectoryExist) {
      this.directories.push(directory);
    }
  }

  calculateSize(): number {
    let size = 0;
    for (const file of this.files) {
      size += file.size;
    }
    for (const subDirectory of this.directories) {
      size += subDirectory.calculateSize();
    }

    return size;
  }

  getAllDirectories(
    maxSizeLimit = Number.MAX_SAFE_INTEGER,
    minSizeLimit = 0
  ): Directory[] {
    const directories: Directory[] = [];
    const size = this.calculateSize();
    if (size <= maxSizeLimit && size >= minSizeLimit) {
      directories.push(this);
    }
    for (const subDirectory of this.directories) {
      directories.push(
        ...subDirectory.getAllDirectories(maxSizeLimit, minSizeLimit)
      );
    }
    return directories;
  }

  findDirectory(name: string): Directory {
    const directory = this.directories.find((d) => d.name === name);

    if (!directory) {
      throw new Error(`directory ${name} not found`);
    }

    return directory;
  }
}

const root = new Directory("/");
let currentDirectory = root;

function handleCommand(command: string) {
  const parts = command.split(" ");
  const commandName = parts[1];

  switch (commandName) {
    case "cd": {
      const dirName = parts[2];
      if (dirName === "..") {
        // go up a directory

        const parentDirectory = currentDirectory.parentDirectory;
        if (parentDirectory) {
          currentDirectory = parentDirectory;
        }
      } else if (dirName === "/") {
        currentDirectory = root;
      } else {
        currentDirectory = currentDirectory.findDirectory(dirName);
      }
      break;
    }
    default:
      break;
  }
}

function handleResult(result: string) {
  const parts = result.split(" ");
  const name = parts[1];
  const size = parseInt(parts[0]);

  if (parts[0] === "dir") {
    currentDirectory.addDirectory(new Directory(name, currentDirectory));
  } else {
    currentDirectory.addFile({ name, size });
  }
}

const lines: string[] = input.split("\n");
let index = 0;
for (const line of lines) {
  index++;
  try {
    if (line.startsWith("$")) {
      handleCommand(line);
    } else {
      handleResult(line);
    }
  } catch (e) {
    console.error("error handling line", index, line, e);
  }
}

function partOne() {
  const directories = root.getAllDirectories(100_000);

  return directories.reduce((acc, d) => acc + d.size, 0);
}

function partTwo() {
  const diskSize = 70_000_000;
  const updateSize = 30_000_000;
  const rootSize = root.size;
  const unusedSpace = diskSize - rootSize;
  const neededSpace = updateSize - unusedSpace;
  const directoriesAboveMinSize = root.getAllDirectories(diskSize, neededSpace);

  const rootRemoved = directoriesAboveMinSize.slice(1);

  const smallest = rootRemoved.sort((a, b) => a.size - b.size)[0];

  return smallest.size;
}
console.log(partOne());
console.log(partTwo());
