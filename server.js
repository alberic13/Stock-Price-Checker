'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

// Security: Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  })
);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: '*' })); // For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB if configured
if (process.env.DB) {
  mongoose.connect(process.env.DB)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

// Compatibility middleware for modern Node and fcctesting.js
app.use('/_api/app-info', (req, res, next) => {
  res._headers = res.getHeaders ? res.getHeaders() : {};
  next();
});

// Test execution helper for local test and Vercel serverless environments
let testsStarted = false;
function runMochaTests() {
  if (testsStarted || runner.report) return;
  testsStarted = true;
  try {
    runner.run();
  } catch (e) {
    console.error('Mocha test error:', e);
  }
}

app.use('/_api/get-tests', (req, res, next) => {
  if (process.env.NODE_ENV === 'test' && !runner.report) {
    runMochaTests();
  }
  next();
});

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API 
apiRoutes(app);  

// 404 Not Found Middleware
app.use(function (req, res) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Start our server and tests!
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  const listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        runMochaTests();
      }, 1500);
    }
  });
}

module.exports = app; // for testing
