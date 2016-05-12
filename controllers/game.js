/* jshint esversion: 6 */
const EventEmitter = require('events');
const World = require('../models/world');

var Game = class Game extends EventEmitter {
  constructor() {
    super();
    this.world = new World();
  }

  /**
  * Updates the state of the world and performs game-logic validations.
  */
  update(gameTime) {
    // Update models
    this.world.update(gameTime);

    // Scores?
    // Networking?
  }
};

module.exports = Game;
