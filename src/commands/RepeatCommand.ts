import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbRepeatCommandError } from '../errors/ijsdb-repeat-command-error';

export class RepeatCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (this.line.length != 0) {
      throw  new ijsdbRepeatCommandError(`Must have zero-length command, got: ${argv.length}`);
    }

    DebuggerState.getLatestCommand().execute();
  }
}
