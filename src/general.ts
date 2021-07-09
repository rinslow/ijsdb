import { BaseCommand } from './commands/BaseCommand';

export interface Argument {
  index: number;
  value: any;
  name?: string;
}

export interface Call {
  file: string;
  line: number;
  methodName: string;
  arguments: Argument[];
}

export type CallStack = Call[];

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

