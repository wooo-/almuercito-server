/* jshint esversion: 6 */
const EventEmitter = require('events');
const Vector3 = require('./vector3');

var GameObject = class GameObject extends EventEmitter {
  /**
  * Class constructor.
  */
  constructor() {
    super();
    this.position = new Vector3();
    this.velocity = new Vector3();
    this.lastUpdate = 0;
  }

  /**
  * Updates the state of the game object. Extending this method allows to
  * define custom motion rules over this.velocity (like force-mass-based)
  * before calling super().
  */
  update(gameTime, world) {
    // p = p + v*dt
    this.position = this.position.add(
      this.velocity.multiply((gameTime - this.lastUpdate) / 1000)
    );

    this.lastUpdate = gameTime;
  }
};

module.exports = GameObject;
