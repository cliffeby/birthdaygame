/**
 * Created by cliff on 12/16/2017.
 */
'use strict';
const credentials = require('./credentials.json');
const aws = require('aws-sdk');
const AWSregion = 'us-east-1';
aws.config = new aws.Config();
aws.config.accessKeyId = credentials.accessKeyId;
aws.config.secretAccessKey = credentials.secretAccessKey;
aws.config.region = AWSregion;
const params = {
    TableName : 'CELEBRITIES',
};

function readDynamoItem(params, callback) {
    var docClient = new aws.DynamoDB.DocumentClient();
    console.log('reading item from DynamoDB table');
    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(data.Item);
        }
    });
}
readDynamoItem(params, function (callback){
});