#!/usr/bin/env node

import { parseArgs, showHelp } from '../dist/cli.js';
import { run } from '../dist/index.js';

const options = parseArgs(process.argv);

if (options.help) {
  console.log(showHelp());
  process.exit(0);
}

if (options.error) {
  console.error(`Error: ${options.error}\n`);
  console.log(showHelp());
  process.exit(1);
}

try {
  await run(options);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
