var AWS = require("aws-sdk");
 
exports.handler = (event, context, callback) => {
    const req = JSON.stringify(event);
    console.log(`Event  ${req} triggered`);
    var s3 = new AWS.S3();
    var sourceBucket =  process.env.source_bucket;
    var destinationBucket = process.env.dest_bucket;
    var objectKey = event.Records[0].s3.object.key;
    var copySource = encodeURI(sourceBucket + "/" + objectKey);
    var copyParams = { Bucket: destinationBucket, CopySource: copySource, Key: objectKey };
    var delParams = { Bucket: destinationBucket, Key: objectKey };
    var eventName = event.Records[0].eventName;
    if(eventName === "ObjectRemoved:Delete") {
        s3.deleteObject(delParams, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log("S3 object delete successful.");
            }
        });
    } else if(eventName === "ObjectCreated:Put") {
        s3.copyObject(copyParams, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log("S3 object copy successful.");
            }
        });
    }
};