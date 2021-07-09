import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbRepeatCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
