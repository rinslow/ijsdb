import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbListCommandError } from '../errors/ijsdb-list-command-error';

export class RepeatCommand implements BaseCommand {
  private static ADVANCE_BY = 3;
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 0) {
      throw  new ijsdbListCommandError("Must have zero-length command.")
    }

    DebuggerState.getLatestCommand().execute();
  }
}
