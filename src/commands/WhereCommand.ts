import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbWhereCommandError } from '../errors/ijsdb-where-command-error';

export class WhereCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 1) {
      throw  new ijsdbWhereCommandError("Must have no args")
    }

    const currentCallStack = DebuggerState.getCurrentCallStack();
    for (const call of currentCallStack.reverse()) {

    }
  }
}
