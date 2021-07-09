import { setTrace } from './index';

describe('hello world', () => {
  it('should be working', () => {
    setTrace()
    expect(true).toBeTruthy()
  })
});
