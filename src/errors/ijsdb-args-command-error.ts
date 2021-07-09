import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbArgsCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
