export abstract class BaseCommand {
  line: string;

  protected constructor(line: string) {
    this.line = line;
  }

  public abstract execute(): void;
}
