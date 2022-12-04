enum GameOutcome {
  LOSS = "LOSS",
  WIN = "WIN",
  DRAW = "DRAW",
}

type OpponentMove = "A" | "B" | "C";
type PlayerMove = "X" | "Y" | "Z";
type GameRow = [OpponentMove, PlayerMove];

const SCORE_MAP: Record<string, number> = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors,
  WIN: 6,
  DRAW: 3,
  LOSS: 0,
};

const RPS_PLAYER_HIERARCHY: Record<string, { win: string; draw: string }> = {
  X: { win: "C", draw: "A" },
  Y: { win: "A", draw: "B" },
  Z: { win: "B", draw: "C" },
};

const RPS_OPPONENT_HIERARCHY: Record<
  string,
  Partial<Record<GameOutcome, PlayerMove>>
> = {
  A: {
    [GameOutcome.WIN]: "Y",
    [GameOutcome.DRAW]: "X",
    [GameOutcome.LOSS]: "Z",
  },
  B: {
    [GameOutcome.WIN]: "Z",
    [GameOutcome.DRAW]: "Y",
    [GameOutcome.LOSS]: "X",
  },
  C: {
    [GameOutcome.WIN]: "X",
    [GameOutcome.DRAW]: "Z",
    [GameOutcome.LOSS]: "Y",
  },
};

function getGameOutcome(
  opponent: OpponentMove,
  player: PlayerMove
): GameOutcome {
  console.log("getGameOutcome", opponent, player);

  if (RPS_PLAYER_HIERARCHY[player].draw === opponent) {
    return GameOutcome.DRAW;
  }

  if (RPS_PLAYER_HIERARCHY[player].win === opponent) {
    return GameOutcome.WIN;
  }

  return GameOutcome.LOSS;
}

function parseInput(input: string): GameRow[] {
  return input.split("\n").map((line) => line.split(" ")) as GameRow[];
}

const parsedInput = parseInput(await Deno.readTextFile("./input.txt"));

function calculateScore(outcome: GameOutcome) {
  let score = 0;
  score += SCORE_MAP[outcome];
  return score;
}

const partOneAnswer = parsedInput.reduce((accum, current) => {
  const [opponent, me] = current;

  const outcome = getGameOutcome(opponent, me);

  return accum + SCORE_MAP[me] + calculateScore(outcome);
}, 0);

console.log("Part One Answer:", partOneAnswer);

const MOVE_MAP = {
  X: GameOutcome.LOSS,
  Y: GameOutcome.DRAW,
  Z: GameOutcome.WIN,
};

const partTwoAnswer = parsedInput.reduce((accum, current) => {
  const [opponent, instructedOutcome] = current;

  const wantedOutcome = MOVE_MAP[instructedOutcome];

  const moveToGetWantedOutcome =
    RPS_OPPONENT_HIERARCHY[opponent][wantedOutcome];

  if (!moveToGetWantedOutcome) {
    throw new Error("No move found to get wanted outcome");
  }

  const outcome = getGameOutcome(opponent, moveToGetWantedOutcome);

  return accum + SCORE_MAP[moveToGetWantedOutcome] + calculateScore(outcome);
}, 0);

console.log("Part Two Answer:", partTwoAnswer);
