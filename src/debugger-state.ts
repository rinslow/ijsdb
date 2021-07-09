export interface Argument {
  name: string;
  value: any;
}

export interface Call {
  file: string;
  line: number;
  methodName: string;
  arguments: Argument[];
}

export type CallStack = Call[];

export class DebuggerState {
  private static CURRENT_LINE_IN_PEEKING = 0;
  private static CURRENT_FILE_IN_PEEKING = "/dev/null";

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
}
