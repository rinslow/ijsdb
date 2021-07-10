import * as readline from 'readline';
import * as chalk from 'chalk';

import { IjsdbNotImplementedError } from './errors/ijsdb-not-implemented-error';
import { ijsdbInternalError } from './errors/ijsdb-internal-error';
import { DebuggerState } from './debugger-state';
import { Argument, Call, CallStack } from './general';
import { evalInScope, getFunctionParameters } from './util';
import { ListCommand } from './commands/ListCommand';
import { RepeatCommand } from './commands/RepeatCommand';
import { BaseCommand } from './commands/BaseCommand';
import { UpCommand } from './commands/UpCommand';
import { DownCommand } from './commands/DownCommand';
import { ArgsCommand } from './commands/ArgsCommand';
import { makeCallEntry } from './printers/entry';
import { WhereCommand } from './commands/WhereCommand';

const DEFAULT_CONTEXT = 1;

const COMMANDS_HANDLER = {
  '': RepeatCommand,
  'l': ListCommand,
  'list': ListCommand,
  'up': UpCommand,
  'u': UpCommand,
  'down': DownCommand,
  'd': DownCommand,
  'a': ArgsCommand,
  'args': ArgsCommand,
  'w': WhereCommand,
  'where': WhereCommand
};

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

  let caller = loadStackToDebugger.caller.caller;

  const callStack: CallStack = frames.map((frame, index) => {
    const groupsMatch = frame.match(frameRegex).groups;

    if (!groupsMatch) {
      throw new ijsdbInternalError(`Could not parse frame ${index}`)
    }

    let args: Argument[] = [];

    if (caller) {
      const argumentNames = getFunctionParameters(caller);

      args = Object.entries(caller.arguments).map((pair) => {
        const argumentIndex = parseInt(pair[0]);

        return { index: argumentIndex, value: pair[1], name: argumentNames[argumentIndex] };
      });

      caller = caller.caller; // Advance to the next caller
    }

    const file = groupsMatch["filePath"];

    const call: Call = {
      line: parseInt(groupsMatch["line"]),
      methodName: groupsMatch["methodName"],
      file: file,
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
    const currentCall: Call = DebuggerState.getCurrentCall();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getArgumentsContext = Object.fromEntries(currentCall.arguments.map((arg) => [arg.name, arg.value]));

    return evalInScope(expression, getArgumentsContext);
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
  if (line.length === 0) {
    return true; // repeat command
  }

  const firstWordInLine = line.split(/\s+/)[0];

  return !!Object.keys(COMMANDS_HANDLER).includes(firstWordInLine);
}

/**
 * execute a debugger command
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function executeCommand(command: string) : void {
  if (command.length === 0) {
    new RepeatCommand("").execute();
    return;
  }

  const firstWordInLine = command.split(/\s+/)[0];

  const commandObject: BaseCommand = new COMMANDS_HANDLER[firstWordInLine](command);
  try {
    commandObject.execute();
    DebuggerState.setLatestCommand(commandObject);
  } catch (error) {
    console.error(`*** ${commandObject.constructor.name}: ${error.message}`);
  }
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
function makeCurrentCallEntry(contextBefore = DEFAULT_CONTEXT,
                              contextAfter = DEFAULT_CONTEXT,
                              language = 'javascript'): string {
  return makeCallEntry(DebuggerState.getCurrentCall(), contextBefore, contextAfter, language);
}

