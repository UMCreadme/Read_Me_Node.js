import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { BaseError } from './error.js';
import { status } from './response.status.js';

dotenv.config();

const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
});

const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.bmp'];

const imgUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        acl: 'public-read-write',
        key: (req, file, callback) => {
            const uploadDirectory = req.query.directory ?? '';
            const extension = path.extname(file.originalname);
            if (!allowedFileTypes.includes(extension)) {
                return cb(new BaseError(status.BAD_REQUEST));
            }
            callback(null, `${uploadDirectory}/${Date.now().toString()}_${file.originalname}`);
        },
        contentType: (req, file, cb) => {
            const mimeType = `image/${path.extname(file.originalname).toLowerCase().split('.').pop()}`;
            cb(null, mimeType);
        }
    })
});

export default imgUploader;
