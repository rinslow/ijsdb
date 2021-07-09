import { Call, CallStack } from './general';
import { BaseCommand } from './commands/BaseCommand';
import { NoCommand } from './commands/NoCommand';

export class DebuggerState {
  private static CURRENT_LINE_IN_PEEKING = 0;
  private static CURRENT_FILE_IN_PEEKING = "/dev/null";
  private static LATEST_COMMAND: BaseCommand = new NoCommand("");

  // First element in array is most recent call.
  private static CURRENT_CALL_STACK: CallStack = [];

  public static getCurrentLineInPeeking(): number {
    return this.CURRENT_LINE_IN_PEEKING;
  }

  public static setCurrentLineInPeeking(currentLineInPeeking: number): void {
    this.CURRENT_LINE_IN_PEEKING = currentLineInPeeking;
  }

  public static getCurrentFileInPeeking(): string {
    return this.CURRENT_FILE_IN_PEEKING;
  }

  public static setCurrentFileInPeeking(currentFileInPeeking: string): void {
    this.CURRENT_FILE_IN_PEEKING = currentFileInPeeking;
  }

  public static getCurrentCallStack(): CallStack {
    return this.CURRENT_CALL_STACK;
  }

  public static setCurrentCallStack(callStack: CallStack): void {
    this.CURRENT_CALL_STACK = callStack;
  }

  public static isInCallStack(file: string, line: number): boolean {
    return this.getCurrentCallStack().some((call) => call.line === line && call.file === file);
  }

  public static getCurrentCall(): Call {
    return this.getCurrentCallStack()[0];
  }

  public static getLatestCommand(): BaseCommand {
    return this.LATEST_COMMAND;
  }

  public static setLatestCommand(command: BaseCommand) {
    this.LATEST_COMMAND = command;
  }
}
