import { BaseCommand } from './BaseCommand';
import { ijsdbHelpCommandError } from '../errors/ijsdb-help-command-error';
import { COMMANDS_HANDLER } from './index';

export class HelpCommand implements BaseCommand {
  private static AMOUNT_OF_COLUMNS = 5;
  private static PADDING_BETWEEN_COLUMNS = 9;
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(' ');
    const argc = argv.length;

    if (argc > 2) {
      throw  new ijsdbHelpCommandError('Use with no args to list all commands, use with arg to get help on specific command');
    }

    if (argc == 1) {
      HelpCommand.showAllCommands();
    }

    if (argc == 2) {
      HelpCommand.showDescriptionOfSpecificCommand(argv[1]);
    }

  }

  private static showAllCommands(): void {
    const message = `
Documented commands (type help <topic>):
========================================
${HelpCommand.commandsListToString(this.possibleCommands())}
`;
    console.log(message);
  }

  private static possibleCommands(): string[] {
    // We don't want the empty command (repeat) so we filter it out.
    return Object.keys(COMMANDS_HANDLER).sort().filter((cmd) => !!cmd);
  }

  /**
   * returns a formatted version of list of strings
   * @example
   * EOF    commands   enable    ll        pp       s                until
   * a      condition  exit      longlist  psource  skip_hidden      up
   * alias  cont       h         n         q        skip_predicates  w
   * args   context    help      next      quit     source           whatis
   * b      continue   ignore    p         r        step             where
   * break  d          interact  pdef      restart  tbreak
   * bt     debug      j         pdoc      return   u
   * c      disable    jump      pfile     retval   unalias
   * cl     display    l         pinfo     run      undisplay
   * clear  down       list      pinfo2    rv       unt
   */
  private static commandsListToString(commands: string[]): string {
    const outputStringsArray: string[] = [];
    for (let i = 0; i < commands.length; i++) {
      const command: string = commands[i];
      outputStringsArray.push(command);
      if ((i + 1) % HelpCommand.AMOUNT_OF_COLUMNS === 0) {
        outputStringsArray.push('\n');
      } else {
        const padding: string = ' '.repeat(HelpCommand.PADDING_BETWEEN_COLUMNS - command.length);
        outputStringsArray.push(padding);
      }
    }

    return outputStringsArray.join('');
  }

  private static showDescriptionOfSpecificCommand(command): void {
    const commands = HelpCommand.possibleCommands();
    if (!commands.includes(command)) {
      throw  new ijsdbHelpCommandError(`Unknown command ${command}`);
    }

    const commandClass = COMMANDS_HANDLER[command];
    console.log(new commandClass('').documentation());
  }

  public documentation(): string {
    return `h(elp)
        Without argument, print the list of available commands.
        With a command name as argument, print help about that command.`;
  }
}
