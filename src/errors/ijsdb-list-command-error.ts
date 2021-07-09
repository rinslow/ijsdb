import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbListCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
