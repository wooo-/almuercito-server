/* jshint esversion: 6 */
'use strict';

const EventEmitter = require('events');
const Dgram = require('dgram');
const Message = require('../models/message');
const defaultPort = 7800;

/**
* Server class definition.
*/
var Server = class Server extends EventEmitter {
  /**
  * Server class constructor.
  */
  constructor(port) {
    super();

    // Game rooms and clients dictionaries
    this.clients = {};
    this.rooms = {};

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
    console.log('Starting listener on port ' + this.port + '...');
    this.socket.bind(this.port);
  }

  /**
  * Handles an incoming message from a remote client.
  */
  handleMessage(msg, rinfo) {

  }

  sendMessage(client, message) {
    if (message.data instanceof Buffer) {
      this.socket.send(
        message.data, 0, message.data.length, client.port, client.address
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
