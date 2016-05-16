/* jshint esversion: 6 */
'use strict';
const EventEmitter = require('events');
const Vector3 = require('./vector3');

let GameObject = class GameObject extends EventEmitter {
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
  update(world) {
    // p = p + v*dt
    this.position = this.position.add(
      this.velocity.multiply((world.time - this.lastUpdate) / 1000)
    );

    this.lastUpdate = world.time;
  }
};

module.exports = GameObject;
