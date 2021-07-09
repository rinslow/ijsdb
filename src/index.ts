import * as fs from 'fs';

import * as readline from 'readline';
import * as chalk from 'chalk';

import { IjsdbNotImplementedError } from './errors/ijsdb-not-implemented-error';
import { ijsdbInternalError } from './errors/ijsdb-internal-error';
import { Argument, Call, CallStack, DebuggerState } from './debugger-state';

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

  loadStackToDebugger()
  rl.setPrompt(makePrompt());
  rl.prompt()
}


/**
 * Loads the current stack to the debugger state.
 */
function loadStackToDebugger(): void {
  const e = new Error();
  const frames = e.stack.split("\n").slice(3);
  const frameRegex = /at (?<methodName>.+?) \((?<filePath>.+?):(?<line>\d+?):(?<col>\d+?)\)/;

  let caller = loadStackToDebugger.caller.caller.caller;

  const callStack: CallStack = frames.map((frame, index) => {
    const groupsMatch = frame.match(frameRegex).groups;

    if (!groupsMatch) {
      throw new ijsdbInternalError(`Could not parse frame ${index}`)
    }

    let args: Argument[] = [];

    if (caller) {
      args = Object.entries(caller.arguments).map((pair) => { return { name: pair[0], value: pair[1] }; });
      caller = caller.caller; // Advance to the next caller
    }

    const call: Call = {
      line: parseInt(groupsMatch["line"]),
      methodName: groupsMatch["methodName"],
      file: groupsMatch["filePath"],
      arguments: args,
    };

    return call;
  });

  DebuggerState.setCurrentCallStack(callStack);
  DebuggerState.setCurrentFileInPeeking(callStack[0].file);
  DebuggerState.setCurrentLineInPeeking(callStack[0].line);
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
  const methodName = call.methodName;
  const otherLines = linesOfCodeForCall(call, contextBefore, contextAfter);
  const codeLines = makeCodeLines(otherLines, contextBefore, language);
  const callArguments = showCallArguments(call);
  const firstLine = `> ${chalk.greenBright(filePath)}(${lineNumber})${chalk.cyan(methodName)}${chalk.blue("()")}`;
  const lines = [firstLine, callArguments, ...codeLines];
  return lines.join("\n");
}

function linesOfCodeForCall(call: Call, contextBefore: number, contextAfter: number): string[] {
  const lineToStartAt = Math.max(call.line - contextBefore - 1, 0);
  const lineToEndAt = call.line + contextAfter;
  const fileContent = fs.readFileSync(call.file, {encoding:'utf8', flag:'r'});
  return fileContent.split(/\r?\n/).slice(lineToStartAt, lineToEndAt);
}

/**
 * print the call args
 * i added this method for debugging the debugger but it might be useful as a feature
 */
function showCallArguments(call: Call): string {
  const separator = "-".repeat(35);
  const argumentsContent = call.arguments.map((argument) => {
    return `${argument.name}: ${argument.value}`;
  });

  return [separator, "Variables:", ...argumentsContent, separator].join("\n");
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
