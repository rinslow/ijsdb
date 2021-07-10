import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbDownCommandError } from '../errors/ijsdb-down-command-error';

export class DownCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 1) {
      // TODO: Support count frames up.
      throw  new ijsdbDownCommandError("Must have no args")
    }

    const currentCallStackPointer = DebuggerState.getCurrentCallStackPointer();

    if (currentCallStackPointer === 0) {
      console.log("*** Newest frame");
      return;
    }

    DebuggerState.setCurrentCallStackPointer(currentCallStackPointer - 1);
    DebuggerState.setCurrentLineInPeeking(DebuggerState.getCurrentCall().line);
    DebuggerState.setCurrentFileInPeeking(DebuggerState.getCurrentCall().file);
  }

  public documentation(): string {
    return `d(own) [count]
        Move the current frame count (default one) levels down in the
        stack trace (to a newer frame).

        Will skip hidden frames.`;
  }
}
