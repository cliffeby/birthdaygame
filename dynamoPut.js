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

const paramsPUT = {
    TableName: 'CELEBRITIES',
    Item: {
    Name: {S:'Bill Fox'},
    Label: {S:'Actor5'},
    Age: {N: '37'},
        Rank : {N: '5000'},
        Sex: {S: 'Male'}
}}
// Call DynamoDB to add the item to the table
 function put(paramsPUT) {
    var doc = new aws.DynamoDB();
    doc.putItem(paramsPUT, function(err,data) {
        if (err) {
            console.log("Error Put", err);
        } else {
            console.log("Success Put", data);
            // callback(data.Item);
        }
    });
};

put(paramsPUT);
