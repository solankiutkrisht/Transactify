const express = require('express');
const https = require('https');
const fs = require('fs');

require('dotenv').config();
const port = process.env.PORT || 443;


const app = express();

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from HTTPS Express server!');
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log('HTTPS server running on port 443');
});
