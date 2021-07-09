import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbUpCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
