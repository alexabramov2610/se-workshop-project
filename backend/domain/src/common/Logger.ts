import winston from 'winston'
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
//npm run debug - start in debug mode
//Logger.debug('Debug messag');
//Logger.error('Error messag');
const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]:\t${message}`;
});
export const Logger = winston.createLogger({
   level: process.env.DEBUG? 'debug' : 'info',
   
  format: format.combine(format.json(),format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),myFormat),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `debug` and below to `events.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', }), 
    new winston.transports.File({ filename: 'logs/events.log', level: process.env.DEBUG? 'debug' : 'info',
}),
    new winston.transports.Console({
    format: myFormat,
      level: process.env.DEBUG? 'debug' : 'info',
})
  ]
});