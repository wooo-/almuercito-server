/* jshint esversion: 6 */
'use strict';

const EventEmitter = require('events');
const Dgram = require('dgram');
const Message = require('../models/message');
const Game = require('./almuercito_game'); // TODO: make this a setting
const defaultPort = 7800;

/**
* Client class definition.
*/
let Client = class Client extends EventEmitter {
  /**
  * Client class constructor.
  */
  constructor(address, port) {
    super();

    // Networking initialization
    this.serverAddress = address;
    this.serverPort = port || defaultPort;
    this.socket = Dgram.createSocket('udp4');

    this.socket.on('message', (msg, rinfo) => {
      this.handleMessage(msg, rinfo);
    });

    // Attempt to connect
    console.log('Listening...');
    let buffer = new Buffer(1);
    buffer[0] = Message.codes.HELLO;
    this.sendMessage(buffer);
  }

  /**
   * Sends a message to the server.
   * @param  {Buffer} buffer The message to be sent.
   */
  sendMessage(buffer) {
    console.log('Sending message...');
    this.socket.send(
      buffer, 0, buffer.length,
      this.serverPort, this.serverAddress
    );
  }

  /**
  * Handles an incoming message from the server.
  */
  handleMessage(messageBuffer, remoteInfo) {
    // Do something
    console.log(messageBuffer);
  }
};

module.exports = Client;
