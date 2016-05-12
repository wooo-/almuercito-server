/* jshint esversion: 6 */
(function() {
  'use strict';

  let Message = class Message {
    constructor(client, buffer) {
      this.client = client;

      // Can't get the message kind from empty buffers
      if (buffer.length === 0) {
        this.buffer = new Buffer([Message.codes.INVALID]);
        return;
      }

      this.buffer = buffer;
    }

    /**
    * Getter for buffer kind.
    */
    get kind() {
      return this.buffer[0];
    }

    /**
    * Setter for buffer kind. Value must be a Message.codes value.
    */
    set kind(value) {
      this.buffer[0] = value;
    }

    /**
    * Returns a deserialized object from the payload of
    * a server object kind o message.
    */
    toServerObject() {
      return JSON.parse(this.buffer.slice(1));
    }
  };

  // Possible values for the first byte of the incoming
  // buffer. It's used to establish the message kind.
  Message.codes = {
    INVALID: 0x00, // Invalid message
    HELLO: 0x11, // 1 byte message
    KEEPALIVE: 0x12, // 1 byte message
    PING: 0x13, // timer synchronization
    SERVEROBJECT: 0x20, // followed by json
    GAMEOBJECT: 0x30 // followed by a byte array
  };

  // Export the Message class
  module.exports = Message;
})();
