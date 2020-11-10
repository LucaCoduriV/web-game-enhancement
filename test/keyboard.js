import chai from 'chai';
import { keyDown } from '../src/keyboard.js';

const { assert } = chai;

describe('keyboard.js', () => {
  it('The keyDown function shoud filter duplicate events', () => {
    let counter = 0;
    const listener = () => {
      counter += 1;
    };
    keyDown(listener, { key: 'ArrowLeft', preventDefault: () => { } });
    keyDown(listener, { key: 'ArrowLeft', preventDefault: () => { } });
    assert.equal(counter, 1);
  });
});
