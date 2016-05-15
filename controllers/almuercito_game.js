/* jshint esversion: 6 */
const Game = require('./Game');
const World = require('../models/world');

var AlmuercitoGame = class AlmuercitoGame extends Game {
  constructor() {
    super();
    this.world = new World();
    this.startTime = 0;
  }

  /**
  * Starts the automatic update of game objects.
  */
  start() {
    this.startTime = Date.now();
    setTimeout(() => {
      this.update(Date.now() - this.startTime);
    }, 1);
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

module.exports = AlmuercitoGame;
