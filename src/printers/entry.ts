import { Call } from '../general';
import { linesOfCodeToPrint, makeCodeLines } from './lines-of-code';
import * as chalk from 'chalk';

/**
 * generate a call entry
 * @param call (Call): the call object to generate for.
 * @param contextBefore (integer): how many preceding lines-of-code to show.
 * @param contextAfter (integer): how many succeeding lines-of-code to show.
 * @param language (string): what language to use.
 * @param usePeek (boolean): if true it will display a line from the peek, otherwise will display the given call.
 *    (available languages here: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
 * @example
 * > /Users/root/tmp/module.js(4)bla()
 *        3     const b = 4;
 *  ----> 4     require('ijsdb').setTrace();
 *        5
 */
export function makeCallEntry(call: Call,
                              contextBefore = 1,
                              contextAfter = 1,
                              language = 'javascript',
                              usePeek = true): string {
  const filePath = call.file;
  const lineNumber = call.line;
  const methodName = call.methodName;
  const otherLines = linesOfCodeToPrint(call, contextBefore, contextAfter, usePeek);
  const codeLines = makeCodeLines(otherLines, contextBefore, language);
  const firstLine = `> ${chalk.greenBright(filePath)}(${lineNumber})${chalk.cyan(methodName)}${chalk.blue('()')}`;
  const lines = [firstLine, ...codeLines];
  return lines.join('\n');
}
