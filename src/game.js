import {
  rocketTTL,
  rocketIncrement,
  collisionRadius,
  keysValues,
  width,
  height,
} from './constants.js';

import { Vehicle, Rocket } from './model.js';
import { collision } from './util.js';
import { Message } from './message.js';

/**
 * A class to manage the state of the game.
 */
export class Game extends Map {
  /**
   * Construct a Game object
   */
  constructor(messageListener) {
    super();
    this.messageListener = messageListener;
    this.counter = 0;
    this.start = new Date().getTime();
    this.counter = 0;
  }

  /**
   * Compute the current game timestamp.
   */
  timestamp() {
    return new Date().getTime() - this.start;
  }

  /**
   * Return the vehicles.
   */
  * vehicles() {
    for (const e of this.values()) {
      if (e instanceof Vehicle) {
        yield e;
      }
    }
  }

  /**
   * Return the rockets.
   */
  * rockets() {
    for (const e of this.values()) {
      if (e instanceof Rocket) {
        yield e;
      }
    }
  }

  /**
   * Generate a unique identifier for storing and synchronizing objects.
   */
  id() {
    return this.counter++;
  }

  /**
   * Initialize a vehicle and set a new key-value pair in the class map,
   * then return the ID of the new-created vehicle.
   *
   * @returns {*}
   */
  join() {
    const id = this.id();
    const timestamp = this.timestamp();
    const vehicle = new Vehicle(id, timestamp, width / 2, height / 2, 0, 0, false, false, false, false, 'rgb(0, 0, 0)');
    this.set(id, vehicle);
    this.messageListener(new Message('join', timestamp));
    for (const entity of this.values()) {
      this.messageListener(new Message('set', entity));
    }
    return id;
  }

  /**
   * Delete a vehicle by its id.
   *
   * @param id
   */
  quit(id) {
    this.delete(id);
    this.messageListener(new Message('delete', id));
  }

  /**
   * Handle the player messages.
   *
   * @param player
   * @param message
   */
  onMessage(id, message) {
    const vehicle = this.get(id);
    const isKeydownEvent = message.action === 'keydown';
    switch (message.object) {
      case keysValues.arrowLeft:
        vehicle.isTurningLeft = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowRight:
        vehicle.isTurningRight = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowUp:
        vehicle.isAccelerating = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.arrowDown:
        vehicle.isReversing = isKeydownEvent;
        this.messageListener(new Message('set', vehicle));
        break;
      case keysValues.space:
        if (isKeydownEvent) {
          const rocket = new Rocket(
            this.id(),
            this.timestamp(),
            vehicle.x,
            vehicle.y,
            vehicle.speed + rocketIncrement,
            vehicle.angle,
          );
          this.set(rocket.id, rocket);
          this.messageListener(new Message('set', rocket));
        }
        break;
      default:
        break;
    }
  }

  /**
   * Moves the state of the game
   */
  move() {
    const timestamp = this.timestamp();
    for (const entity of this.values()) {
      while (entity.timestamp < timestamp) entity.move();
    }
    for (const rocket of this.rockets()) {
      if (rocket.timestamp - rocket.created > rocketTTL) {
        this.delete(rocket.id);
        this.messageListener(new Message('delete', rocket.id));
      } else {
        for (const vehicle of this.vehicles()) {
          if (collision(rocket.x, rocket.y, vehicle.x, vehicle.y, collisionRadius)) {
            vehicle.health = Math.max(vehicle.health - 1, 0);
            this.delete(rocket.id);
            this.messageListener(new Message('set', vehicle));
            this.messageListener(new Message('delete', rocket.id));
          }
        }
      }
    }
  }
}

export class Replica extends Map {
  constructor() {
    super();
    this.start = new Date().getTime();
  }

  /**
   * Compute the current game timestamp.
   */
  timestamp() {
    return new Date().getTime() - this.start;
  }

  onMessage(message) {
    switch (message.action) {
      case 'join':
        this.start = new Date().getTime() - message.object;
        break;
      case 'set':
        this.set(message.object.id, message.object);
        break;
      case 'delete':
        this.delete(message.object);
        break;
      default:
        break;
    }
  }

  move() {
    const timestamp = this.timestamp();
    for (const entity of this.values()) {
      while (entity.timestamp < timestamp) entity.move();
    }
  }
}
