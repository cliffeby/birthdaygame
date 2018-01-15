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

const d = addDays(new Date(), 0);
const dString = d.toISOString().substring(0, 10);
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    console.log('DATE',result);
    return result;
}
console.log('DATE', dString);

const params = {
    TableName : 'CELEBRITIES',
    IndexName : 'Date-RankWiki-index',
    KeyConditionExpression: "#date = :date",
    ScanIndexForward: false,
    ExpressionAttributeNames:{
        "#date": "Date"
    },
    ExpressionAttributeValues: {
        ":date":dString
    }
};

function proNoun(person, callback){
        var pronoun;
        for (var qq in person.Items) {
            console.log('QQ',qq);
            if (person.Items[qq].Sex == "male") {
                pronoun = "He";
            } else {
                pronoun = "She";
            }
            console.log('PRO', pronoun, person.Items[qq]['Name']);
            if (person.Items[qq].hasOwnProperty('Snippet') & person.Items[qq].hasOwnProperty('Name')) {
                console.log('SNIPP1', person.Items[qq].Snippet, person.Items[qq].Name);
                person.Items[qq].Snippet = person.Items[qq].Snippet.replace(person.Items[qq].Name, pronoun);
                console.log('SNIPP2', person.Items[qq].Snippet, person.Items[qq].Name);
            }
        }
        callback(person);
}
function readDynamoItem(params, callback) {
    var docClient = new aws.DynamoDB.DocumentClient();
    console.log('reading item from DynamoDB table');
    docClient.query(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(data);
        }
    });
}
readDynamoItem(params, function(callback){
    proNoun(callback, function(done) {
        console.log('CallBack', done.Items[0]);
    });
});


