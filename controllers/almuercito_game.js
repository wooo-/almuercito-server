/* jshint esversion: 6 */
'use strict';
const Game = require('./Game');
const World = require('../models/world');

let AlmuercitoGame = class AlmuercitoGame extends Game {
  constructor() {
    super();
    this.world = new World();
    this.run = false;

    // Timing
    this.startTime = 0; // Server time, milliseconds
    this.lastUpdate = Date.now();
    this.physicsResolution = 1; // Physics time resolution, in milliseconds
    this.updateTime = 5; // Time between updates, in milliseconds
  }

  /**
  * Starts the automatic update of game objects.
  */
  start() {
    this.startTime = Date.now();
    this.lastUpdate = this.startTime;
    this.run = true;

    // Start the update loop
    setTimeout(() => {
      this.update(Date.now() - this.startTime);
    }, 1);
  }

  /**
  * Updates the state of the world and performs game-logic validations.
  */
  update(gameTime) {
    let loopTime = Date.now();
    let worldTime = this.lastUpdate;

    // Pyshics simulation
    while (worldTime < gameTime) {
      // Update models
      this.world.update(gameTime);

      // Scores?
      // Networking?

      worldTime += this.physicsResolution;
    }

    if (this.run) {
      // Schedule a new update
      setTimeout(() => {
        this.update(Date.now() - this.startTime);
      }, Math.max(0, this.updateTime - (Date.now() - loopTime)));
    }
  }

  /**
  * Stops the update loop.
  */
  end() {
    this.run = false;
    super.end();
  }
};

module.exports = AlmuercitoGame;
