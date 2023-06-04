const winston = require('winston');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, '..', 'Drivelog'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'Drivelog'));
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '..', 'Drivelog', 'app.log') })
  ]
});

module.exports = logger;
