const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

exports.Logger = function (customLabel){
    return createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            colorize: '#fff',
            format: combine(
                format.splat(),
                label({ label: customLabel }),
                timestamp(),
                myFormat
                 )  
        }),
        new transports.File({
            filename: 'logs/winston.log', 
            level: 'info',
            maxsize: 5242880,
            format: combine(
                format.splat(),
                timestamp(),
                label({ label: customLabel }),
                myFormat
                 )  
        })
    ]
})
};