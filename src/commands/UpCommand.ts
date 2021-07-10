import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbUpCommandError } from '../errors/ijsdb-up-command-error';
import { DownCommand } from './DownCommand';
import { getFileContent } from '../util';

export class UpCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 1) {
      // TODO: Support count frames up.
      throw  new ijsdbUpCommandError("Must have no args")
    }

    const currentCallStack = DebuggerState.getCurrentCallStack();
    const currentCallStackPointer = DebuggerState.getCurrentCallStackPointer();

    if (currentCallStack.length === currentCallStackPointer + 1) {
      console.log("*** Oldest frame");
      return;
    }

    DebuggerState.setCurrentCallStackPointer(currentCallStackPointer + 1);
    DebuggerState.setCurrentLineInPeeking(DebuggerState.getCurrentCall().line);
    DebuggerState.setCurrentFileInPeeking(DebuggerState.getCurrentCall().file);

    try {
      const newFile = DebuggerState.getCurrentFileInPeeking();
      getFileContent(newFile);
    } catch (e) {
      console.log("*** Oldest frame");
      new DownCommand("").execute();
    }
  }

  public documentation(): string {
    return `u(p) [count]
        Move the current frame count (default one) levels up in the
        stack trace (to an older frame).

        Will skip hidden frames.`;
  }
}
