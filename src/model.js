import {
  tick,
  acceleration,
  reverse,
  friction,
  steeringRadius,
  height,
  width,
  maxHealth,
  vehicleWidth,
  vehicleHeight,
} from './constants.js';
import { adjacent, position, opposite } from './util.js';

/**
 * A base class for representing moving objects.
 */
class MovingEntity {
  /**
   * Construct a MovingObject.
   * @param {*} id The identifier.
   * @param {*} timestamp The initialization timestamp in milliseconds.
   * @param {*} x The x coordinate.
   * @param {*} y The y coordinate.
   * @param {*} speed The speed expressed in pixels/second.
   * @param {*} angle The angle expressed in radians.
   */
  constructor(id, timestamp, x, y, speed, angle) {
    this.id = id;
    this.timestamp = timestamp;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
  }

  /**
   * Updates the state of the moving entity
   */
  move() {
    throw new Error('Not implemented');
  }

  /**
   * Draws the moving entity with context of the canvas
   */
  render() {
    throw new Error('Not implemented');
  }
}

/**
 * A class for representing rockets.
 * @augments MovingEntity
 */
class Rocket extends MovingEntity {
  /**
   * Construct a Rocket.
   * @param {*} id The identifier.
   * @param {*} timestamp The initialization timestamp.
   * @param {*} x The x coordinate.
   * @param {*} y The y coordinate.
   * @param {*} speed The speed expressed in pixels/second.
   * @param {*} angle The angle expressed in radians.
   */
  constructor(id, timestamp, x, y, speed, angle) {
    super(id, timestamp, x, y, speed, angle);
    this.created = timestamp;
  }

  /**
   * Updates the state of the moving entity
   */
  move() {
    // Update the time
    this.timestamp += tick;

    // Compute the x and y distances
    const distance = (this.speed / 1000) * tick;
    const xDistance = adjacent(distance, this.angle);
    const yDistance = opposite(distance, this.angle);

    // Update the position
    this.x = position(this.x + xDistance, width);
    this.y = position(this.y + yDistance, height);
  }

  /**
   * Draws the moving entity with context of the canvas
   * @param {*} context
   */
  render(context) {
    context.beginPath();
    context.arc(0, 0, 2, 0, Math.PI * 2);
    context.stroke();
  }
}

/**
 * A class for representing vehicles.
 * @augments MovingEntity
 */
class Vehicle extends MovingEntity {
  /**
   * Construct a Vehicle.
   * @param {*} id The identifier.
   * @param {*} timestamp The initialization timestamp.
   * @param {*} x The x coordinate.
   * @param {*} y The y coordinate.
   * @param {*} speed The speed expressed in pixels/second.
   * @param {*} angle The angle expressed in radians.
   * @param {*} color The color expressed in RGB hex code.
   */
  constructor(id, timestamp, x, y, speed, angle,
    isAccelerating, isReversing, isTurningLeft, isTurningRight, color) {
    super(id, timestamp, x, y, speed, angle);
    this.isAccelerating = isAccelerating;
    this.isReversing = isReversing;
    this.isTurningLeft = isTurningLeft;
    this.isTurningRight = isTurningRight;
    this.color = color;
    this.health = maxHealth;
  }

  /**
   * Updates the state of the moving entity
   */
  move() {
    // Update the time
    this.timestamp += tick;

    // Compute the speed
    this.speed *= friction;
    this.speed += acceleration * this.isAccelerating;
    this.speed -= reverse * this.isReversing;

    // Compute the arc distance and the steering angle
    const arcDistance = (this.speed / 1000) * tick;
    const steeringAngle = arcDistance / steeringRadius;
    this.angle += steeringAngle * this.isTurningRight;
    this.angle -= steeringAngle * this.isTurningLeft;

    // Compute the linear distance and the position
    const linearDistance = 2 * opposite(steeringRadius, steeringAngle / 2);
    const xDistance = adjacent(linearDistance, this.angle);
    const yDistance = opposite(linearDistance, this.angle);
    this.x = position(this.x + xDistance, width);
    this.y = position(this.y + yDistance, height);
  }

  /**
   * Draws the moving entity with context of the canvas
   * @param {*} context
   */
  render(context) {
    context.beginPath();
    context.lineTo(vehicleWidth, -vehicleHeight);
    context.lineTo(-vehicleWidth, -vehicleHeight);
    context.lineTo(-vehicleWidth, vehicleHeight);
    context.lineTo(vehicleWidth, vehicleHeight);
    context.lineTo(vehicleWidth, -vehicleHeight);
    context.strokeStyle = this.color;
    context.stroke();
  }
}

export { MovingEntity, Vehicle, Rocket };
