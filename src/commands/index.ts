import { RepeatCommand } from './RepeatCommand';
import { ListCommand } from './ListCommand';
import { UpCommand } from './UpCommand';
import { DownCommand } from './DownCommand';
import { ArgsCommand } from './ArgsCommand';
import { WhereCommand } from './WhereCommand';
import { HelpCommand } from './HelpCommand';
import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';

export const COMMANDS_HANDLER = {
  '': RepeatCommand,
  'repeat': RepeatCommand,
  'l': ListCommand,
  'list': ListCommand,
  'up': UpCommand,
  'u': UpCommand,
  'down': DownCommand,
  'd': DownCommand,
  'a': ArgsCommand,
  'args': ArgsCommand,
  'w': WhereCommand,
  'where': WhereCommand,
  '?': HelpCommand,
  'help': HelpCommand,
  'h': HelpCommand,
};


/**
 * execute a debugger command
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function executeCommand(command: string): void {
  if (command.length === 0) {
    new RepeatCommand('').execute();
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
 * find out if a string is a command or an expression to be evaluated
 **/
export function isCommand(line: string): boolean {
  if (line.length === 0) {
    return true; // repeat command
  }

  const firstWordInLine = line.split(/\s+/)[0];

  return !!Object.keys(COMMANDS_HANDLER).includes(firstWordInLine);
}
