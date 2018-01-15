/**
 * Created by cliff on 12/16/2017.
 */
'use strict';
const credentials = require('./credentials.json');
var aws = require('aws-sdk');
const AWSregion = 'us-east-1';
const params = {
    TableName : 'CELEBRITIES',
    IndexName : 'Date-index',
    KeyConditionExpression: "#date = :date",
    ExpressionAttributeNames:{
        "#date": "Date"
    },
    ExpressionAttributeValues: {
        ":date":"2018-01-06"
    }
};
aws.config = new aws.Config();
aws.config.accessKeyId = credentials.accessKeyId;
aws.config.secretAccessKey = credentials.secretAccessKey;
aws.config.region = AWSregion;



function readDynamoItem(params, callback) {


    var docClient = new aws.DynamoDB.DocumentClient();
    console.log('reading item from DynamoDB table');
    docClient.query(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(data);
        }
    });
}
var delParams = {
    TableName: 'CELEBRITIES',
    Key: {
        "Name":'Conor Donovan',
        "Label": 'actor'
    }
}
// Call DynamoDB to add the item to the table
 function del(delParams) {
    var doc = new aws.DynamoDB.DocumentClient();
    doc.delete(delParams, function(err,data) {
        if (err) {
            console.log("Error DEL", err);
        } else {
            console.log("Success Delete", data);
            // callback(data.Item);
        }
    });
};

del(delParams);
