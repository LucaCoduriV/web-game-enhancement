import { Message } from './message.js';
import { keysValues } from './constants.js';

const listenedKeysList = new Set([
  keysValues.arrowLeft,
  keysValues.arrowRight,
  keysValues.arrowUp,
  keysValues.arrowDown,
  keysValues.space,
]);

const downKeys = new Set();

export function keyDown(listener, event) {
  const { key } = event;
  if (listenedKeysList.has(key)) {
    event.preventDefault();
    if (!downKeys.has(key)) {
      downKeys.add(key);
      listener(new Message(event.type, event.key));
    }
  }
}

export function keyUp(listener, event) {
  const { key } = event;
  event.preventDefault();
  if (downKeys.has(key)) {
    downKeys.delete(key);
    listener(new Message(event.type, event.key));
  }
}

/**
 * A function that listen to keyboard events.
 * @param listener
 */
export function keyboard(listener) {
  window.addEventListener('keydown', (event) => keyDown(listener, event));
  window.addEventListener('keyup', (event) => keyUp(listener, event));
}
