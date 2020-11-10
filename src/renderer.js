import {
  width,
  height,
  steeringRadius,
  debugInformationOffset,
  debugInformationLineHeight,
  debugLineWidth,
  style,
} from './constants.js';

/**
 * A class that renders the state of the game.
 */
class Renderer {
  /**
   * Constructor.
   * @param {*} game The state of the game.
   * @param {*} canvas The canvas element used to render the game.
   */
  constructor(game, context) {
    this.game = game;
    this.context = context;
  }

  /**
   * Draws the moving entity with context of the canvas
   */
  render() {
    // Reset the context
    this.context.strokeStyle = style.stroke;
    this.context.font = style.font;
    this.context.clearRect(0, 0, width, height);

    // Draw the entities
    for (const entity of this.game.values()) {
      this.context.save();
      this.context.translate(entity.x, entity.y);
      this.context.rotate(entity.angle);
      entity.render(this.context);
      this.renderDebug(entity);
      this.context.restore();
    }
  }

  renderDebug(entity) {
    // Draw the debug information of the entity
    this.context.fillStyle = style.debugFill;
    this.context.strokeStyle = style.debugStroke;
    const x = -debugInformationOffset;
    let y = debugInformationOffset;
    for (const [key, value] of Object.entries(entity)) {
      if (typeof value === 'number') {
        this.context.fillText(`${key}: ${value.toFixed(0)}`, x, y += debugInformationLineHeight);
      }
    }
    // Draw the debug line that indicates the way of the vehicle
    if (!(entity.isTurningLeft ^ entity.isTurningRight)) {
      this.context.beginPath();
      this.context.moveTo(-debugLineWidth, 0);
      this.context.lineTo(debugLineWidth, 0);
      this.context.stroke();
    }
    // Draw the "turning left" debug line
    if (entity.isTurningLeft) {
      this.context.beginPath();
      this.context.arc(0, -steeringRadius,
        steeringRadius, (Math.PI * 1) / 4, (Math.PI * 3) / 4);
      this.context.stroke();
    }
    // Draw the "turning right" debug line
    if (entity.isTurningRight) {
      this.context.beginPath();
      this.context.arc(0, steeringRadius,
        steeringRadius, (Math.PI * 5) / 4, (Math.PI * 7) / 4);
      this.context.stroke();
    }
  }
}

export default Renderer;
