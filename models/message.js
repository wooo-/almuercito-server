/* jshint esversion: 6 */
(function() {
  'use strict';

  let Message = class Message {
    constructor(client, buffer) {
      this.client = client;
      this.kind = Message.codes.INVALID;

      // Can't get the message kind from empty buffers
      if (buffer.length === 0) {
        return;
      }

      // Use the message kind to determine if its
      // contents need to be parsed
      this.kind = buffer[0];
      if (this.kind === Message.codes.SERVEROBJECT) {
        this.data = JSON.parse(buffer.slice(1));
      } else if (this.kind === Message.codes.GAMEOBJECT) {
        this.data = buffer.slice(1);
      }
    }
  };

  // Possible values for the first byte of the incoming
  // buffer. Is used to Establish the message kind.
  Message.codes = {
    INVALID: 0x00, // Invalid message
    HELLO: 0x01, // 1 byte message
    KEEPALIVE: 0x02, // 1 byte message
    SERVEROBJECT: 0x10, // followed by json
    GAMEOBJECT: 0x20 // followed by a byte array
  };

  // Export the Message class
  module.exports = Message;
})();
