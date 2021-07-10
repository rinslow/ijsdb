import { BaseCommand } from './BaseCommand';

export class NoCommand implements BaseCommand {
  line: string;

  public constructor(line: string) {
    this.line = line;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public execute(): void {

  }

  documentation(): string {
    return '';
  }
}
