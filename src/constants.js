export const width = 800; // The width of the renderer's viewport
export const height = 600; // The height of the renderer's viewport

export const tick = 10; // The duration of a tick in milliseconds
export const acceleration = 10; // The acceleration constant used by the vehicle when accelerating
export const reverse = 5; // The reverse constant used by the vehicle when reversing
export const friction = 0.98; // The friction constant that slows down the vehicle

export const maxHealth = 100; // The maximal health of a vehicle
export const steeringRadius = 100; // The steering radius constant used when turning left or right
export const rocketTTL = 1000; // The time to live of a rocket
export const rocketIncrement = 600; // The speed increment that applies to rockets
export const collisionRadius = 5; // The radius of a vehicle when checking for by a collision

export const vehicleWidth = 6; // The width of the vehicle's rectangle
export const vehicleHeight = 3; // The height of the vehicle's rectangle

// Contains the values of the possibly pressed keys in the app
export const keysValues = {
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  space: ' ',
};

// The offset of the debug information compared to the entity's position
export const debugInformationOffset = 20;
// The line height (the "margin" between each text line) of the debug information
export const debugInformationLineHeight = 12;
// The width of the debug line that indicates the way of the vehicle
export const debugLineWidth = 80;

// Contains some used CSS styles
export const style = {
  stroke: 'rgb(0, 0, 0)',
  font: '11px Arial',
  debugFill: 'rgba(0, 0, 0, 0.25)',
  debugStroke: 'rgba(0, 0, 0, 0.25)',
};
