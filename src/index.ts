import * as readline from 'readline';
import * as chalk from 'chalk';

import { IjsdbNotImplementedError } from './errors/ijsdb-not-implemented-error';
import { Call, DebuggerState } from './debugger-state';

/**
 * entrypoint to the ijsdb
 */
export function setTrace(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    onLine(line);
    rl.setPrompt(makePrompt());
    rl.prompt()
  });

  rl.setPrompt(makePrompt());
  rl.prompt()
}

/**
 * lifecycle hook that is called after every newline
 */
function onLine(line: string): void {
  if (isCommand(line)) {
    executeCommand(line);
    throw new IjsdbNotImplementedError("Commands not implemented yet")
  }

  else {
    console.log(evaluate(line));
  }
}

/**
 * evaluate an expression using the current context, with or without a stack trace
 */
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

/**
 * find out if a string is a command or an expression to be evaluated
 **/
function isCommand(line: string): boolean {
  if (line) {
    return false;
  }

  return false;
}

/**
 * [NOT IMPLEMENTED] execute a debugger command
 */
function executeCommand(command: string) : void {

}

/**
 * generate the input prompt
 */
function makePrompt(): string {
  const stackEntry = makeCurrentCallEntry();
  const promptLine = chalk.green('ijsdb> ');
  return `\
${stackEntry}

${promptLine}\
`;
}

/**
 * generate the current call entry from the top of the stack
 * @param contextBefore (integer): how many preceding lines-of-code to show.
 * @param contextAfter (integer): how many succeeding lines-of-code to show.
 * @param language (string): what language to use.
 *    (available languages here: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
 * @example
 * > /Users/root/tmp/module.js(4)bla()
 *        3     const b = 4;
 *  ----> 4     require('ijsdb').setTrace();
 *        5
 */
function makeCurrentCallEntry(contextBefore = 1,
                              contextAfter = 1,
                              language = 'javascript'): string {
  return makeCallEntry(DebuggerState.getCurrentCall(), contextBefore, contextAfter, language);
}

/**
 * generate a call entry
 * @param call (Call): the call object to generate for.
 * @param contextBefore (integer): how many preceding lines-of-code to show.
 * @param contextAfter (integer): how many succeeding lines-of-code to show.
 * @param language (string): what language to use.
 *    (available languages here: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
 * @example
 * > /Users/root/tmp/module.js(4)bla()
 *        3     const b = 4;
 *  ----> 4     require('ijsdb').setTrace();
 *        5
 */
function makeCallEntry(call: Call,
                       contextBefore = 1,
                       contextAfter = 1,
                       language='javascript'): string {
  const filePath = call.file;
  const lineNumber = call.line;
  const methodName = "methodName";
  const otherLines = ["    const b = 4;", "    require('ijsdb').setTrace();", "    "];
  const codeLines = makeCodeLines(otherLines, contextBefore, language);
  const firstLine = `> ${chalk.greenBright(filePath)}(${lineNumber})${chalk.cyan(methodName)}${chalk.blue("()")}`;
  const lines = [firstLine, ...codeLines];
  return lines.join("\n");
}

/**
 * syntax-highlight lines of code, order them, and denote current line.
 * @param lines (string[]): lines of code to highlight.
 * @param contextBefore (number): how many preceding lines-of-code are shown.
 * @param language (string): what language to use.
 *    (available languages here: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
 * @example
 *        3     const b = 4;
 *  ----> 4     require('ijsdb').setTrace();
 *        5
 */
function makeCodeLines(lines: string[],
                       contextBefore: number,
                       language = 'javascript'): string[] {
  const currentLineInPeeking = DebuggerState.getCurrentLineInPeeking();
  const currentFileInPeeking = DebuggerState.getCurrentFileInPeeking();

  const firstLineNumber = currentLineInPeeking - contextBefore;
  return lines.map((line, index) => {
    const lineIndex = firstLineNumber + index;
    const syntaxHighlightedLine = highlightSyntax(line, language);
    const isLineBeingExecuted = DebuggerState.isInCallStack(currentFileInPeeking, lineIndex);
    const linePrefix = isLineBeingExecuted ? " ---->" : "      ";
    return `${chalk.greenBright(linePrefix)} ${chalk.greenBright(lineIndex)} ${syntaxHighlightedLine}`
  });
}

/**
 * [NOT IMPLEMENTED] highlight a line in the syntax of a language with BASH colors.
 */
function highlightSyntax(line: string, language = 'javascript'): string {
  // TODO: Syntax highlighting
 return line;
}
