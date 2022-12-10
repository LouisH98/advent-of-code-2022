const rawInput = await Deno.readTextFile("input.txt");

const [rawCargo, rawInstructions] = rawInput.split("\n\n");

const instructions = rawInstructions.split("\n");

function parseCargo(rawCargo: string): string[][] {
  const numberIndexes: number[] = [];

  const lines = rawCargo.split("\n");
  const lastLine = lines.at(-1)?.split("");
  if (!lastLine) return [];

  // create a index of where the characters are
  lastLine.forEach((val, index) => {
    if (val.trim().length) numberIndexes.push(index);
  });

  const stacks: string[][] = Array.from(Array(numberIndexes.length), () => []);

  lines.forEach((line) => {
    const lineChars = line.split("");

    lineChars.forEach((char, i) => {
      // check it's a character
      if (/[A-Z]/.test(char)) {
        const stackIndex = numberIndexes.indexOf(i);

        // insert char in the correct stack
        stacks[stackIndex].push(char);
      }
    });
  });

  return stacks;
}

/*
Instructions come in the format: 
move <amount> from <from_stack> to <to_stack>
we parse this to an object:
{
  amount: number,
  from: string,
  to: string
}
*/
interface Instruction {
  amount: number;
  from: number;
  to: number;
}
function parseInstructions(instructions: string[]): Instruction[] {
  return instructions.map((instruction) => {
    const [amount, from, to] = instruction
      .split(" ")
      .filter((val) => /[0-9]/.test(val))
      .map(Number);

    return {
      amount,
      from,
      to,
    };
  });
}

function partOne(cargo: string[][], instructions: Instruction[]) {
  instructions.forEach((instruction) => {
    const { amount, from, to } = instruction;

    const fromStack = cargo[from - 1];
    const toStack = cargo[to - 1];

    for (let i = 0; i < amount; i++) {
      const item = fromStack.shift();
      if (item) toStack.unshift(item);
    }

    console.log(`Moving ${amount} from ${fromStack} to ${toStack}`);
  });

  return cargo.map((stack) => stack.at(0)).join("");
}

// in part two, we can move multiple items from a stack at once
function partTwo(cargo: string[][], instructions: Instruction[]) {
  instructions.forEach((instruction) => {
    const { amount, from, to } = instruction;

    const fromStack = cargo[from - 1];
    const toStack = cargo[to - 1];

    // we can move multiple items at once
    const items = fromStack.splice(0, amount);
    toStack.unshift(...items);

    console.log(`Moving ${amount} from ${fromStack} to ${toStack}`);
  });

  return cargo.map((stack) => stack.at(0)).join("");
}

console.log(partOne(parseCargo(rawCargo), parseInstructions(instructions)));
console.log(partTwo(parseCargo(rawCargo), parseInstructions(instructions)));
