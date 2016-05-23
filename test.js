/* jshint esversion: 6 */
'use strict';

const Server = require('./controllers/server');
const Message = require('./models/message');
const Dgram = require('dgram');
const testPort = 7801;

let Tester = class Tester {
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
  }

  handleMessage(message, remoteInfo) {
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

  runNext() {
    this.currentTestIndex++;
    if (this.currentTestIndex >= this.tests.length) {
      console.log('Testing completed.');
      return;
    }

    let result = this.tests[this.currentTestIndex].test(this.socket);
    if (typeof this.tests[this.currentTestIndex].waitAnswer !== 'function') {
      this.evalResult(result);
    }
  }

  run() {
    this.server.start();
  }
};

/********* TESTS STARTS HERE *************/

let tester = new Tester([
  {
    name: 'Server HELLO test',
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
  }
]);
tester.run();
