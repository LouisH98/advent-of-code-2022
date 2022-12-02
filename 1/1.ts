function parseInput(input: string): number[][] {
  return input
    .split("\n\n")
    .map((line) => line.split("\n"))
    .map((elfFoods) => {
      return elfFoods.map(Number);
    });
}

function getMostGreedyElf(caloryCounts: number[][]): number {
  const sums = caloryCounts.map((elfFoods) =>
    elfFoods.reduce((sum, current) => sum + current)
  );

  return sums.sort((a, b) => b - a)[0];
}

const parsedInput = parseInput(await Deno.readTextFile("./input.txt"));

const answer = getMostGreedyElf(parsedInput);

console.log(answer);
