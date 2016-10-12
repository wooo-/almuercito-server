/* jshint esversion: 6 */
'use strict';

const EventEmitter = require('events');
const Dgram = require('dgram');
const Message = require('../models/message');
const Game = require('./almuercito_game'); // TODO: make this a setting
const defaultPort = 7800;
const numberOfRooms = 1; // TODO: make this a setting

/**
* Server class definition.
*/
let Server = class Server extends EventEmitter {
  /**
  * Server class constructor.
  */
  constructor(port) {
    super();

    // Game rooms and clients dictionaries
    this.clients = {};
    this.rooms = {};
    this.numberOfRooms = numberOfRooms;

    // Networking initialization
    this.port = port || defaultPort;
    this.socket = Dgram.createSocket('udp4');

    this.socket.on('error', (err) => {
      this.handleError(err);
    });

    this.socket.on('message', (msg, rinfo) => {
      this.handleMessage(msg, rinfo);
    });

    this.socket.on('listening', () => {
      this.handleListening();
    });
  }

  /**
  * Starts the server listener.
  */
  start() {
    // Create the rooms
    for (let i = 0; i < this.numberOfRooms; ++i) {
      let game = new Game();
      this.rooms[`Room ${i}`] = game;
      game.start();
    }

    // Start the network listener
    console.log('Starting listener on port ' + this.port + '...');
    this.socket.bind(this.port);
  }

  /**
  * Handles an incoming message from a remote client.
  */
  handleMessage(messageBuffer, remoteInfo) {
    if (messageBuffer.length === 0) {
      return;
    }

    let clientId = `${remoteInfo.address}:${remoteInfo.port}`;
    let codes = Message.codes;

    // If unkown client
    if (!(clientId in this.clients)) {
      // Join client if we are asked to
      if (messageBuffer[0] === codes.HELLO) {
        this.clients[clientId] = {
          room: null,
          address: remoteInfo.address,
          port: remoteInfo.port,
          lastSeen: Date.now()
        };
        console.log('New client connected: ' + clientId);
      } else {
        // Unknown client, ignore message
        return;
      }
    }

    let message = new Message(this.clients[clientId], messageBuffer);

    // Server answers
    let answer = null;
    // Low level message kinds are between 0x10 and 0x1F
    if ((message.kind & 0xF0) === 0x10) {
      answer = this.answerForLowLevelMessage(message);
    } else {
      // Server objects in 0x20 (json). Game object in 0x30 (byte arrays)
      return; // TODO: implement game and server objects
    }

    if (answer !== null) {
      this.sendMessage(answer);
    }
  }

  /**
  * Returns an answer for a low level server message, that is, a message
  * that does not require to be delivered to the game engine.
  */
  answerForLowLevelMessage(message) {
    let codes = Message.codes;
    let answer = null;

    // Server HELLO
    if (message.kind === codes.HELLO) {
      answer = new Message(message.client, new Buffer([codes.HELLO]));

    // Server KEEPALIVE
    } else if (message.kind === codes.KEEPALIVE) {
      answer = new Message(message.client, new Buffer([codes.KEEPALIVE]));

    // Server PING (clock sync)
    } else if (message.kind === codes.PING && message.buffer.length === 7) {
      let room = message.client.room;
      if (room !== null) {
        let buffer = new Buffer(11); // request (7 bytes) + 4 additional bytes
        buffer[0] = codes.PING;

        // Sequence number
        buffer[1] = message.buffer[1];
        buffer[2] = message.buffer[2];

        // Client time
        buffer[3] = message.buffer[3];
        buffer[4] = message.buffer[4];
        buffer[5] = message.buffer[5];
        buffer[6] = message.buffer[6];

        // Server time (4 bytes)
        buffer.writeUInt32BE(Date.now() - room.startTime, 7);
        answer = new Message(message.client, buffer);
      }

    }

    return answer;
  }

  /**
   * Sends a message to a client.
   * @param  {Message} message An object with a client and a buffer.
   */
  sendMessage(message) {
    this.socket.send(
      message.buffer, 0, message.buffer.length,
      message.client.port, message.client.address
    );
  }

  /**
  * Handles a socket error on the listener.
  */
  handleError(err) {
    console.log(`Server error:\n${err.stack}`);
    this.socket.close();
  }

  /**
  * Method that is called when the listener starts successfully.
  */
  handleListening() {
    var address = this.socket.address();
    console.log(`Server listening on ${address.address}:${address.port}`);

    this.emit('listening');
  }
};

module.exports = Server;
