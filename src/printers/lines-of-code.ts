import { Call } from '../general';
import { DebuggerState } from '../debugger-state';
import { getFileContent } from '../util';
import * as chalk from 'chalk';

/**
 * return relevant lines of code to display in the peek window
 * @param usePeek (boolean): if true it will display a line from the peek, otherwise will display the given call.
 */
export function linesOfCodeToPrint(call: Call, contextBefore: number, contextAfter: number, usePeek = true): string[] {
  const currentLineToPeek = usePeek ? DebuggerState.getCurrentLineInPeeking() : call.line;
  const lineToStartAt = Math.max(currentLineToPeek - contextBefore - 1, 0);
  const lineToEndAt = currentLineToPeek + contextAfter;
  const fileContent = getFileContent(call.file);
  return fileContent.split(/\r?\n/).slice(lineToStartAt, lineToEndAt);
}

/**
 * syntax-highlight lines of code, order them, and denote current line.
 * @param lines (string[]): lines of code to highlight.
 * @param contextBefore (number): how many preceding lines-of-code are shown.
 * @param language (string): what language to use.
 *    (available languages here: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
 * @example
 *        3     const b = 4;
 *  ----> 4     require('ijsdb').setTrace();
 *        5
 */
export function makeCodeLines(lines: string[],
                              contextBefore: number,
                              language = 'javascript'): string[] {
  const currentLineInPeeking = DebuggerState.getCurrentLineInPeeking();
  const currentFileInPeeking = DebuggerState.getCurrentFileInPeeking();

  const firstLineNumber = currentLineInPeeking - contextBefore;
  return lines.map((line, index) => {
    const lineIndex = firstLineNumber + index;
    const syntaxHighlightedLine = highlightSyntax(line, language);
    const isLineBeingExecuted = DebuggerState.isInCallStack(currentFileInPeeking, lineIndex);
    const linePrefix = isLineBeingExecuted ? ' ---->' : '      ';
    return `${chalk.greenBright(linePrefix)} ${chalk.greenBright(lineIndex)} ${syntaxHighlightedLine}`;
  });
}


/**
 * [NOT IMPLEMENTED] highlight a line in the syntax of a language with BASH colors.
 */
function highlightSyntax(line: string, language = 'javascript'): string {
  // TODO: Syntax highlighting
  return line;
}

