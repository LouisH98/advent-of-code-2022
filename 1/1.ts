function parseInput(input: string): number[][] {
  return input
    .split("\n\n")
    .map((line) => line.split("\n"))
    .map((elfFoods) => {
      return elfFoods.map(Number);
    });
}

function getMostGreedyElf(
  caloryCounts: number[][],
  ranking: number = 0
): number {
  const sums = caloryCounts.map((elfFoods) =>
    elfFoods.reduce((sum, current) => sum + current)
  );

  return sums.sort((a, b) => b - a)[ranking];
}

const parsedInput = parseInput(await Deno.readTextFile("./input.txt"));

const partOne = getMostGreedyElf(parsedInput);

const partTwo = [0, 1, 2]
  .map((rank) => getMostGreedyElf(parsedInput, rank))
  .reduce((sum, current) => sum + current);

console.log(partOne);
console.log(partTwo);
