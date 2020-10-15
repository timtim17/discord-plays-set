'use strict';

const http = require('http');

http.createServer((req, res) => {
  res.writeHead(421, { 'Content-Type': 'text/plain' });
  res.end('hey! this is discord bot!', 'utf-8');
}).listen(process.env.PORT || 8154);

