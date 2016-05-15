/* jshint esversion: 6 */
const EventEmitter = require('events');

/**
* Base Game definition. Emits the following events:
* message, playerAdded, playerRemoved, started, ended.
*/
var Game = class Game extends EventEmitter {
  constructor() {
    super();
  }

  /**
  * Method that is going to be called by the server when a player connects.
  * Override this method to add the player to a custom player list before
  * emitting the playerAdded event.
  * @return {Boolean} false to reject the player.
  */
  addPlayer(player) {
    this.emit('playerAdded', player);
    return true;
  }

  /**
  * Method that is going to be called by the server when a player disconnects.
  * Override this method to remove the player from a custom player list before
  * emitting the playerRemoved event.
  * @param {object?} player - The same object that was added in addPlayer.
  */
  removePlayer(player) {
    this.emit('playerRemoved', player);
  }

  /**
  * Method that is going to be called by the server when
  * a new message arrives. Override this method to implement
  * custom message handling.
  * @param {object?} player - The player who sent the message.
  * @param {Buffer} message - A buffer with the raw message data.
  */
  receiveMessage(player, message) {
    // Message handling should be done overriding this
  }

  /**
  * Placeholder [remove from api?], not really necessary since messages
  * are sent by the 'message' event.
  */
  emitMessage(player, message) {
    this.emit('message', player, message);
  }

  /**
  * Method that is going to be called by the server before adding any players to
  * start new game. Override this method to create initial game objects.
  */
  start() {
    this.emit('started');
  }

  /**
  * Method that should be called when the game ends externally (server shutdown)
  * or by it own rules (game logic). Server will release connections and
  * resources used after this.
  */
  end() {
    this.emit('ended');
  }
};

module.exports = Game;
