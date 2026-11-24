// Two-Sentence Horror entry for make.fun bounty
// u-suroto-two-sentence-horror-acea9253
// Writes exactly one two-sentence horror story (1-400 chars, no trailing
// newline) to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output).
"use strict";

const fs = require("fs");
const path = require("path");

const STORY =
  "I finally sleep well again, because every night at three in the morning someone tucks the blanket back over me and whispers that I am safe. " +
  "Last night I stayed awake, and at three in the morning I watched my own hands tuck the blanket in.";

function countSentences(text) {
  // Count sentence terminators (. ! ?) followed by end-of-string or a space.
  const matches = text.match(/[.!?](?=\s|$)/g);
  return matches ? matches.length : 0;
}

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");

  const text = STORY;

  // Guards: length 1-400 code points, not whitespace-only, exactly 2 sentences,
  // no newline inside the text.
  const len = [...text].length;
  if (len < 1 || len > 400) {
    throw new Error("story length out of range: " + len + " code points");
  }
  if (text.trim().length === 0) {
    throw new Error("story is whitespace-only");
  }
  if (countSentences(text) !== 2) {
    throw new Error("story must be exactly 2 sentences");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("story must not contain a newline");
  }
  if (!/[.!?]$/.test(text)) {
    throw new Error("story must end with a sentence terminator");
  }

  fs.writeFileSync(outPath, text, "utf8");

  // Round-trip validation: read back and verify byte-identical content.
  const back = fs.readFileSync(outPath, "utf8");
  if (back !== text) {
    throw new Error("round-trip validation failed");
  }
}

main();
