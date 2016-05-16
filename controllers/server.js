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

    let probe = Dgram.createSocket('udp4');
    probe.send('Loopback test completed!', 0, 24, this.port, 'localhost');
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

    // Join client if new
    if (!(clientId in this.clients) && messageBuffer[0] === codes.HELLO) {
      this.clients[clientId] = {
        room: null,
        address: remoteInfo.address,
        port: remoteInfo.port,
        lastSeen: Date.now()
      };
    }

    let message = new Message(this.clients[clientId], messageBuffer);

    // Server answers
    let answer = null;
    if (message.kind & 0xF0 === 0x10) {
      answer = this.answerForLowLevelMessage(message);
    } else {
      return; // TODO: implement game and server objects
    }

    if (message !== null) {
      this.sendMessage(this.clients[clientId], message);
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
      answer = new Message(new Buffer([codes.HELLO]));

    // Server KEEPALIVE
    } else if (message.kind === codes.KEEPALIVE) {
      answer = new Message(new Buffer([codes.KEEPALIVE]));

    // Server PING (clock sync)
    } else if (message.kind === codes.PING && message.buffer.length === 3) {
      let room = message.client.room;
      if (room !== null) {
        let buffer = new Buffer(7);
        buffer[0] = codes.PING;
        buffer[1] = message.buffer[1];
        buffer[2] = message.buffer[2];
        buffer.writeUInt32BE(Date.now() - room.startTime, 3);
        answer = new Message(buffer);
      }
    }

    return answer;
  }

  sendMessage(message) {
    if (message.buffer instanceof Buffer) {
      this.socket.send(
        message.buffer, 0, message.buffer.length,
        message.client.port, message.client.address
      );
    }
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
  }
};

module.exports = Server;
