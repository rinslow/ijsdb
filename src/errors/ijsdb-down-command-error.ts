import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbDownCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
