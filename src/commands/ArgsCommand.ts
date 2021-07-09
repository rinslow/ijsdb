import { BaseCommand } from './BaseCommand';
import { Call } from '../general';
import { DebuggerState } from '../debugger-state';
import { ijsdbArgsCommandError } from '../errors/ijsdb-args-command-error';

export class ArgsCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public execute(): void {
    const argv = this.line.split(" ");
    const argc = argv.length;

    if (argc != 1) {
      throw  new ijsdbArgsCommandError("Must have no args")
    }

    this.showCallArguments(DebuggerState.getCurrentCall())
  }

  /**
   * print the call args
   * i added this method for debugging the debugger but it might be useful as a feature
   */
  private showCallArguments(call: Call): void {
    const separator = "-".repeat(35);
    const argumentsContent = call.arguments.map((argument) => {

      let value;
      try {
        value = JSON.stringify(argument.value);
      }
      catch (TypeError) {
        value = argument.value;
      }

      return `${argument.name}: ${value}`;
    });

    console.log([separator, "Args:", ...argumentsContent, separator].join("\n"));
  }
}
