import moment from 'moment-timezone';
import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import env from '@root/config.json';

const { combine, timestamp, label, printf } = winston.format;
 
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;    // log 출력 포맷 정의
});

const appendTimestamp = winston.format((info, opts) => {
    if(opts.tz)
        info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DD HH:mm:ss');
    return info;
});

const options = {
  // log파일
  file: {
    level: 'info',
    filename: `${env.LOG_PATH}/${env.LOG_FILE}_%DATE%.log`, // 로그파일을 남길 경로    
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: false,
    maxsize: 20971520, // 20MB
    maxFiles: 10,
    colorize: false,
    format: combine(
      label({ label: 'BACKEND-FILE' }),
      timestamp(),
      appendTimestamp({ tz: 'Asia/Seoul' }),
      myFormat    // log 출력 포맷
    )
  },
  // 개발 시 console에 출력
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: true,
    format: combine(
      label({ label: 'BACKEND' }),
      timestamp(),
      appendTimestamp({ tz: 'Asia/Seoul' }),      
      myFormat
    )
  }
}
 
let logger = new winston.createLogger({
  transports: [
    // new winston.transports.File(options.file) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
    new (winstonDaily)(options.file)
  ],
  exitOnError: false, 
});
 
if(env.PROFILE !== 'PROD'){
  logger.add(new winston.transports.Console(options.console)) // 개발 시 console로도 출력
}
 
export default logger;
