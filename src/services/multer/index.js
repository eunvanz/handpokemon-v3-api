import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = path =>
  multer({
    storage: multerS3({
      s3,
      bucket: 'files.handpokemon.com',
      acl: 'public-read',
      key: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fullPath = `${path}/${fileName}`;
        cb(null, fullPath);
      }
    })
  });

export default upload;
