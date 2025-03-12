const { S3 } = require('@aws-sdk/client-s3'); // Use the v3 client
require('dotenv').config();

// AWS Configuration
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

module.exports = s3;
