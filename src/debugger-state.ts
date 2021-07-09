export interface Call {
  file: string;
  line: number;
}

export type CallStack = Call[];

export class DebuggerState {
  private static CURRENT_LINE_IN_PEEKING = 3;
  private static CURRENT_FILE_IN_PEEKING = "/dev/null";

  // First element in array is most recent call.
  private static CURRENT_CALL_STACK: CallStack = [{ file: "/dev/null", line: 4 }];

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
    return this.getCurrentCallStack().includes({ file, line });
  }

  public static getCurrentCall(): Call {
    return this.getCurrentCallStack()[0];
  }
}
