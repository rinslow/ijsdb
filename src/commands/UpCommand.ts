import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbUpCommandError } from '../errors/ijsdb-up-command-error';

export class UpCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 1) {
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
  }
}
