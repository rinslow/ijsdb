import { ijsdbCommandError } from './ijsdb-command-error';

export class ijsdbWhereCommandError extends ijsdbCommandError {
  constructor(msg: string) {
    super(msg);
  }
}
