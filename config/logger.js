const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = 'logs';
if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(), //comment this out for live env
        new transports.File({ filename: path.join(logDir, 'sequelize.log')}),
    ],
});

module.exports = logger;