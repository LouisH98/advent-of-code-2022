// in the protocol used by elves, the start-of-packet marker is indicated by a sequence of 4 unique characters.
// given a datastream buffer (input) we need to find the first occurrence of the start-of-packet marker
// and the number of characters from the beginning of the buffer, to the end of the start-of-packet marker.
const input = await Deno.readTextFile("input.txt");

function findStartOfPacketMarker(
  buffer: string,
  startOfPacketMarketLength = 4
): number {
  // make pointers to the start and end of the window we are checking
  let start = 0;
  let end = startOfPacketMarketLength;

  // loop through the buffer until we find the start of packet marker
  while (true) {
    // get the current window
    const window = buffer.slice(start, end);

    // check if the window is unique
    if (new Set(window).size === startOfPacketMarketLength) {
      // if it is, we have found the start of packet marker
      break;
    }

    // if it isn't, move the window along by one character
    start++;
    end++;

    // if we have reached the end of the buffer, we haven't found the start of packet marker
    if (end > buffer.length) {
      return -1;
    }
  }
  return end;
}

// part one
console.log(findStartOfPacketMarker(input));

// part two
console.log(findStartOfPacketMarker(input, 14));
