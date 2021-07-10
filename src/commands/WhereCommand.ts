import { BaseCommand } from './BaseCommand';
import { DebuggerState } from '../debugger-state';
import { ijsdbWhereCommandError } from '../errors/ijsdb-where-command-error';
import { makeCallEntry } from '../printers/entry';
import { doesFileExist } from '../util';

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
    const outputLines = [];
    for (const call of currentCallStack.slice().reverse()) {
      // slice() is needed so as not to mutate the original array
      if (doesFileExist(call.file)) {
          outputLines.push(makeCallEntry(call, 1, 1, 'javascript', false));
        }
    }

    console.log(outputLines.join("\n"))
  }
}
