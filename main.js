/* jshint esversion: 6 */
(function() {
  'use strict';

  const Server = require('./controllers/server.js');

  let server = new Server();
  server.start();
})();
