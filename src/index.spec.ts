import { helloWorld } from './index';

describe('hello world', () => {
  it('should be working', () => {
    helloWorld()
    expect(true).toBeTruthy()
  })
});
