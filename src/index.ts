import * as readline from 'readline';
import * as chalk from 'chalk';
import { IjsdbNotImplementedError } from './errors/ijsdb-not-implemented-error';

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
  if (isCommand(line)) {
    throw new IjsdbNotImplementedError("Commands not implemented yet")
  }

  else {
    console.log(evaluate(line));
  }
}

function evaluate(expression: string, withStackTrace = false): unknown {
  try {
    return eval(expression);
  }

  catch(e) {
    let output = `*** ${e.name}: ${e.message}`;

    if (withStackTrace) {
      // TODO: Stack trace is useless, we need to build virtual stack.
      throw new IjsdbNotImplementedError("Stack trace is not implemented yet");
      output = output.concat('\n', chalk.red(e.stack));
    }

    return output
  }
}

function isCommand(line: string): boolean {
  if (line) {
    return false;
  }
  
  return false;
}

/**
 * generate the leading arrow in front of traceback or debugger
 */
function makePrompt(): string {
  return chalk.green('ijsdb> ');
}
