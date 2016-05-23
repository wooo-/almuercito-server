/* jshint esversion: 6 */
'use strict';

const Server = require('./controllers/server');
const Message = require('./models/message');
const Dgram = require('dgram');
const testPort = 7801;

/**
 * Class that runs every test and report their results.
 */
let Tester = class Tester {
  /**
   * Class constructor. Creates a server and a socket to be used in tests.
   * @param  {array} tests Array of test objects with name and test attributes.
   */
  constructor(tests) {
    this.server = new Server(testPort);
    this.socket = Dgram.createSocket('udp4');
    this.socket.on('message', (message, remoteInfo) => {
      this.handleMessage(message, remoteInfo);
    });
    this.server.on('listening', () => {
      this.runNext();
    });
    this.tests = tests;
    this.currentTestIndex = -1;
    this.timer = null;
  }

  /**
   * Handles an incoming message from the server, sending the message to the
   * running test for evaluation.
   */
  handleMessage(message, remoteInfo) {
    clearTimeout(this.timer);
    if (this.currentTestIndex >= this.tests.length) {
      return;
    }

    if (typeof this.tests[this.currentTestIndex].waitAnswer === 'function') {
      let result = this.tests[this.currentTestIndex].waitAnswer(
        message, remoteInfo
      );

      this.evalResult(result);
    }
  }

  /**
   * Evaluates the result of a test.
   * @param  {true|string} result Must be true or the failure reason.
   */
  evalResult(result) {
    if (result === true) {
      console.log('PASSED: ' + this.tests[this.currentTestIndex].name);
      this.runNext();
    } else {
      console.log('FAILED: ' + this.tests[this.currentTestIndex].name);
      console.log(result);
      this.runNext();
    }
  }

  /**
   * Runs the next test. This is automatically called when the previous
   * test is completed successfully.
   */
  runNext() {
    this.currentTestIndex++;
    if (this.currentTestIndex >= this.tests.length) {
      console.log('Testing completed.');
      return;
    }

    this.timer = setTimeout(() => {
      this.evalResult('Test timed out.');
    }, 1000);

    let result = this.tests[this.currentTestIndex].test(this.socket);
    if (typeof this.tests[this.currentTestIndex].waitAnswer !== 'function') {
      this.evalResult(result);
    }
  }

  /**
   * This is the public method that should be used to start testing.
   */
  run() {
    this.server.start();
  }
};

/********* TESTS STARTS HERE *************/

let tester = new Tester([
  {
    name: 'HELLO message test',
    test: (socket) => {
      let helloMessage = new Buffer(1);
      helloMessage[0] = Message.codes.HELLO;
      socket.send(helloMessage, 0, helloMessage.length, testPort, 'localhost');
    },

    waitAnswer: (message) => {
      if (message[0] === Message.codes.HELLO && message.length === 1) {
        return true;
      } else {
        return 'Unexpected remote answer: ' + message.toString();
      }
    }
  },

  {
    name: 'KEEPALIVE message test',
    test: (socket) => {
      let aliveMessage = new Buffer(1);
      aliveMessage[0] = Message.codes.KEEPALIVE;
      socket.send(aliveMessage, 0, aliveMessage.length, testPort, 'localhost');
    },

    waitAnswer: (message) => {
      if (message[0] === Message.codes.KEEPALIVE && message.length === 1) {
        return true;
      } else {
        return 'Unexpected remote answer: ' + message.toString();
      }
    }
  },

  {
    name: 'PING message test',
    test: (socket) => {
      let pingMessage = new Buffer(7);
      pingMessage[0] = Message.codes.PING;

      // Sequence number
      pingMessage[1] = 0x23;
      pingMessage[2] = 0x42;

      // Local time
      pingMessage[3] = 0x01;
      pingMessage[4] = 0x02;
      pingMessage[5] = 0x04;
      pingMessage[6] = 0x08;

      socket.send(pingMessage, 0, pingMessage.length, testPort, 'localhost');
    },

    waitAnswer: (message) => {
      if (message[0] === Message.codes.PING && message.length === 11) {
        if (message[1] !== 0x23 || message[2] !== 0x42) {
          return 'Wrong sequence number in server answer';
        } else if (message[3] + message[4] + message[5] +
          message[6] !== 0x0F || message[6] !== 0x08) {
          return 'Wrong client time in server answer';
        } else {
          return true;
        }
      } else {
        return 'Unexpected remote answer: ' + message.toString();
      }
    }
  }
]);
tester.run();
