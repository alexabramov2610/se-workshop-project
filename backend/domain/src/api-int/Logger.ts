import winston from 'winston'
import daily from 'winston-daily-rotate-file'

const format = winston.format;
/*
  emerg: 0, 
  alert: 1, 
  crit: 2, 
  error: 3, 
  warning: 4, 
  notice: 5, 
  info: 6, 
  debug: 7
*/
// npm run debug - start in debug mode
// logger.debug('Debug messag');
// logger.error('Error messag');


const myFormat = format.printf(({level, message, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}]:\t${message}`;
});
const silent = process.env.SILENT ? true : false;
const debug = process.env.DEBUG ? true : false;
const testMode = process.env.TEST_MODE ? true : false;
export const logger = winston.createLogger({
    level: process.env.DEBUG ? 'debug' : 'info',

    format: format.combine(format.json(), format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), myFormat),
    transports: [
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `debug` and below to `events.log`
        new daily({
            filename: testMode ? `logs/%DATE%/error-TEST.log` : `logs/%DATE%/error-%DATE%.log`,
            level: 'error',
            silent
        }),
        new daily({
            filename: testMode ? `logs/%DATE%/events-TEST%DATE%.log` : 'logs/%DATE%/events-%DATE%.log',
            level: debug ? 'debug' : 'info',
            silent

        }),

        new winston.transports.Console({format: myFormat, level: debug ? 'debug' : 'info', silent})
    ]
});