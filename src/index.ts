import * as readline from 'readline';
import * as chalk from 'chalk';

export function setTrace(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    onLine(line);
    rl.prompt()
  });

  rl.setPrompt(makePrompt());
  rl.prompt()
}

function onLine(line: string): void {
  console.log(`Got ${line}`);
}

/**
 * generate the leading arrow in front of traceback or debugger
 */
function makePrompt(): string {
  return chalk.green('ijsdb> ');
}
