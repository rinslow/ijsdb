import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbListCommandError } from '../errors/ijsdb-list-command-error';

export class ListCommand implements BaseCommand {
  private static ADVANCE_BY = 3;
  line: string;

  protected constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc === 0) {
      throw  new ijsdbListCommandError("Cannot have zero-length command.")
    }

    if (argc > 2) {
      throw  new ijsdbListCommandError(`either use 'l' or 'list' with no arguments (advances by ${ListCommand.ADVANCE_BY}) or give a specific line number as an argument.`)
    }

    let nextLine: number;

    if (argc === 1) {
      const currentLineInPeeking = DebuggerState.getCurrentLineInPeeking();
      nextLine = currentLineInPeeking + ListCommand.ADVANCE_BY;
    }

    if (argc == 2) {
      nextLine = parseInt(argv[1]);
      if (isNaN(nextLine)) {
        throw new ijsdbListCommandError("Argument must be an integer, it will be the line to jump to.")
      }
    }

    DebuggerState.setCurrentLineInPeeking(nextLine)
  }
}
