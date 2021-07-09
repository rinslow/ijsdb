import { ijsdbError } from './ijsdb-error';

export class IjsdbNotImplementedError extends ijsdbError {
  constructor(msg: string) {
    super(msg);
  }
}
