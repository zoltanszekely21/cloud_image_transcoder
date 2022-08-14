
'use strict';
 
const im = require('imagemagick');
const fs = require('fs');
var AWS = require('aws-sdk');
//AWS.config.update({region: 'eu-central-1'});
const s3 = new AWS.S3();
var cloudfront = new AWS.CloudFront();
 
const BUCKET = process.env.BUCKET;
const ALLOWED_DIMENSIONS = new Set();
const ALLOWED_IMAGE_TYPES = new Set();
if (process.env.ALLOWED_DIMENSIONS) {
  const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
  dimensions.forEach((dimension) => ALLOWED_DIMENSIONS.add(dimension));
}
 
if (process.env.ALLOWED_IMAGE_TYPES) {
  const image_types = process.env.ALLOWED_IMAGE_TYPES.split(/\s*,\s*/);
  image_types.forEach((type) => ALLOWED_IMAGE_TYPES.add(type));
}
 
const invalidateCfObject = (key) => {
    return new Promise(function (resolve, reject) {
        
    const distId = process.env.CF_DistributionId; 
    var invalidationPath = key;
    console.log('invalidation path : ' + invalidationPath);  
    var callRef = Date.now();
    console.log('Date.now() : ' + Date.now() + ',  toString() :' 
        + callRef.toString()); 
    var params = {
      DistributionId: distId,
      InvalidationBatch: { 
        CallerReference: callRef.toString(),
        Paths: { 
            Quantity: 1,
            Items: [  '/'+invalidationPath  ]
        }
      }
    };
    cloudfront.createInvalidation(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
        return reject(err); }// an error occurred
    else     {
        console.log('invalidation result :' + JSON.stringify(data));
        resolve(data);          // successful response
    }
    });
    });
};
 
const resizeImage = (reqParams) => {
    return new Promise(function (resolve, reject) {
        if(!reqParams.base64Image) {
            const errMsg = 'Invalid resize request: no "base64Image" field supplied';
            console.log(errMsg);
            return reject(errMsg);
        }
        const tempFilePath = `/tmp/resized${(reqParams.imgType || '.png')}`;
        
        const params = {
            srcData: reqParams.base64Image,
            dstPath: tempFilePath,
            width: reqParams.width,
            height: reqParams.height
        };
        im.resize(params, function(err, resp) {
            if (err) {
                console.log(err);
                return reject(err);
            } 
            resolve(tempFilePath);
       });
    });
};
 
 
exports.handler = (event, context, callback) => {
    
    const bucketKey = event.params.querystring.key;
    
    const match = bucketKey.match(/((\d+)x(\d+))\/(.*)/);
    const imageTtype = bucketKey.match(/\.[0-9a-z]+$/i);
    
    const image_type = imageTtype[0];
    const dimensions = match[1];
    const width = parseInt(match[2], 10);
    const height = parseInt(match[3], 10);
    const originalKey = match[4];
    
    if(ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(dimensions)) {
        const dimErrorObj = {
        errorType : "Forbidden",
        status : 403,
        requestId : context.awsRequestId,
        message : "unsupported image dimensions."
        };
       callback(JSON.stringify(dimErrorObj));
       return;
    }
    
    if(ALLOWED_IMAGE_TYPES.size > 0 && !ALLOWED_IMAGE_TYPES.has(image_type)) {
        const typeErrorObj = {
        errorType : "Forbidden",
        status : 403,
        requestId : context.awsRequestId,
        message : "unsupported image type."
        };
       callback(JSON.stringify(typeErrorObj));
       return;
    }
 
    const imagePath = 'img/' + originalKey;
   
    const bucketName = BUCKET; 
    
    s3.getObject({
                Bucket: bucketName, //orgBucketName, 
                Key: imagePath
              }).promise()
    .then(data => resizeImage({base64Image: new Buffer(data.Body), width: width, height: height, imgType: image_type}))
    
    .then(filePath => fs.readFileSync(filePath))
    .then(buffer => {
                    s3.putObject({
                    Bucket: bucketName, 
                    Key: bucketKey,
                    Body: buffer,
                    ContentType: 'image/png',
                    CacheControl: 'max-age=604800'
                }).promise();
                return buffer;
    })
    .then(buffer => {
            invalidateCfObject(bucketKey);
            return buffer;
    })
    .then(buffer => callback(null, buffer.toString('base64')))
    .catch(err => {
        console.log(err.toString());
        var errObj = {
            errorType : "Internal Server Error",
            status : 500,
            requestId : context.awsRequestId,
            message : err.toString()
        };
        callback(JSON.stringify(errObj));
    });
 };