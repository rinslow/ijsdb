import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbHelpCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
