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

    // Message handling strategies
    this.messageHandlers = {};
    this.messageHandlers[Message.codes.HELLO] = this.handleHello;

    // Networking initialization
    this.serverAddress = address;
    this.serverPort = port || defaultPort;
    this.connected = false;
    this.socket = Dgram.createSocket('udp4');

    this.socket.on('error', (err) => {
      if (!this.connected) {
        // I guess we were trying to connect...
        console.log('Connection failed.');

        // Since UDP doesn't care about connections it's probably a DNS error
        console.log(err);
      }
    });

    this.socket.on('message', (msg, rinfo) => {
      this.handleMessage(msg, rinfo);
    });

    // Attempt to connect
    console.log('Connecting...');
    let buffer = new Buffer(1);
    buffer[0] = Message.codes.HELLO;
    this.sendMessage(buffer);
  }

  /**
   * Sends a message to the server.
   * @param  {Buffer} buffer The message to be sent.
   */
  sendMessage(buffer) {
    this.socket.send(
      buffer, 0, buffer.length,
      this.serverPort, this.serverAddress
    );
  }

  /**
  * Handles an incoming message from the server.
  */
  handleMessage(messageBuffer, remoteInfo) {
    // Delegate the message handling to the strategy for that kind of message
    if (messageBuffer.length > 0 &&
        this.messageHandlers.hasOwnProperty(messageBuffer[0].toString())) {
      this.messageHandlers[messageBuffer[0].toString()](messageBuffer);
    }
  }

  /**
  * Handles a server hello message.
  */
  handleHello() {
    if (!this.connected) {
      this.connected = true;
      console.log('Connected!');
    }
  }
};

module.exports = Client;
