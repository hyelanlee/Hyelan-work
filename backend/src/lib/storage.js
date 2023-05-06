import multer from '@koa/multer';
import moment from 'moment';
import sha256 from 'crypto-js/sha256';   
import env from '@root/config.json';
import fs from 'fs';

const storage = (pathName) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (pathName) {
        cb(null, `${env.FILE_UPLOAD_PATH}/${pathName}/`)
      } else {
        const searchParams = new URLSearchParams(req.url);
        for (const param of searchParams) {
          if (param[0].endsWith('upath')) {
            if (!fs.existsSync(`${env.FILE_UPLOAD_PATH}/${param[1]}`)) {
              fs.mkdirSync(`${env.FILE_UPLOAD_PATH}/${param[1]}/`);
            }
            cb(null, `${env.FILE_UPLOAD_PATH}/${param[1]}/`)
          }
        }
      }      
    },
    filename: function (req, file, cb) {
        const hashDigest = sha256(
            file.originalname + moment().format('YYYYMMDDHHmmss'),
        ).toString();
        cb(null, hashDigest.substring(0, 16) + '-' + file.originalname);  
    }
  })
  return diskStorage;
};

export default storage;
