const config = require('../config');


module.exports = function (tempPath, rString) {
    let AWS = require('aws-sdk'),
        fs = require('fs');

    // let rString = helper.randomString(24, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');


// For dev purposes only
    AWS.config.update({ accessKeyId: config.S3AccessKey, secretAccessKey: config.S3Secret });

// Read in the file, convert it to base64, store to S3
    let tempUploadedFilePath = process.cwd()+ '/'+tempPath;
    fs.readFile(tempUploadedFilePath, function (err, data) {
        if (err) { throw err; }

        let base64data = new Buffer(data, 'binary');

        let s3 = new AWS.S3();
        s3.putObject({
            Bucket: config.S3Bucket,
            Key: rString + '.jpg',
            Body: base64data,
            ACL: 'public-read'
        },function (resp) {
            console.log(arguments);
            console.log('Successfully uploaded package.');

        });

    });


 };
