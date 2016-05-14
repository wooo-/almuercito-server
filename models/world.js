/* jshint esversion: 6 */
const EventEmitter = require('events');
const Vector3 = require('./vector3');

let World = class World extends EventEmitter {
  /**
  * Class constructor.
  */
  constructor() {
    super();

    // World constants
    this.gravity = new Vector3(0, 0, -9.81);

    // World objects
    this.gameObjects = [];
  }

  /**
  * Updates the state of the game objects contained within this world.
  */
  update(gameTime) {
    for (let i = 0; i < this.gameObjects.length; ++i) {
      this.gameObjects[i].update(gameTime, this);
    }
  }
};

module.exports = World;
