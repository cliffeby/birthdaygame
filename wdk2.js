/**
 * Created by cliff on 10/24/2017.
 */
const credentials = require('./credentials.json');
const wdk = require('wikidata-sdk');
const aws = require('aws-sdk');
const AWSregion = 'us-east-1';
aws.config = new aws.Config();
aws.config.accessKeyId = credentials.accessKeyId;
aws.config.secretAccessKey = credentials.secretAccessKey;
aws.config.region = AWSregion;

var paramsPUT = {
    TableName: 'CELEBRITIES',
    }
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

var d = addDays(new Date(),0);
var day = d.getDate();
var month = d.getMonth() + 1;
var dString = d.toISOString().substring(0,10);
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// const simplifiedResults = wdk.simplifySparqlResults(results)
const axios = require('axios');
const authorQid = 'Q535'
const sparql = `
SELECT DISTINCT (YEAR(?date) AS ?year) ?personLabel ?personDescription ?genderLabel WHERE {
  BIND(MONTH(NOW()) AS ?nowMonth)
  BIND(DAY(NOW()) AS ?nowDay)
  ?person wdt:P569 ?date.
  ?person wdt:P21 ?gender.
  ?person wdt:P166 ?award.
  ?person wdt:P27 wd:Q30.
  { ?person wdt:P106 wd:Q10871364. }
  UNION
  { ?person wdt:P106 wd:Q3665646. }
  UNION
  { ?person wdt:P106 wd:Q19204627. }
  UNION
  { ?person wdt:P106 wd:Q11303721. }
  UNION
  { ?person wdt:P106 wd:Q10800557. }
  UNION
  { ?person wdt:P106 wd:Q11774891. }
  OPTIONAL { ?person wdt:P570 ?d. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  FILTER(!BOUND(?d))
  FILTER((YEAR(?date)) > 1930)
  FILTER(((MONTH(?date)) = `+ month +`)&& ((DAY(?date)) = `+day+`))
}
LIMIT 25
`
const url = wdk.sparqlQuery(sparql);
let celebrity = {};
let celebrities=[];
let name = [];
let age = [];
let sex = [];
let label=[];
axios.get(url)
    .then(function (response) {
        // for (var i = 0; i < 3; i++) {
            for (var i = 0; i < response.data.results.bindings.length; i++) {
            name[i] = response.data.results.bindings[i].personLabel.value;
            sex[i] = response.data.results.bindings[i].genderLabel.value;
            age[i] = 2017- response.data.results.bindings[i].year.value;
               label[i] = response.data.results.bindings[i].personDescription.value;
                // label[i] = "Athlete";
            realPerson(name[i],sex[i],age[i],label[i], function(datagS){
                celebrity.presence = datagS.webPages.totalEstimatedMatches;
                celebrity.name = datagS.queryContext.originalQuery;
                celebrity.sex = datagS.sex;
                celebrity.age = datagS.age;
                celebrity.label = datagS.label;

                findWiki(datagS, function(snippet){
                    // console.log('responseWiki', response);
                    celebrity.snippet = snippet;
                    celebrities.push(celebrity);
                    console.log('CELEB',celebrity);
                    paramsPUT.Item = {
                        Name: {S:celebrity.name},
                        Label: {S:celebrity.label},
                        Age: {N: celebrity.age.toString()},
                        Rank : {N: celebrity.presence.toString()},
                        Sex: {S: celebrity.sex},
                        Snippet: {S: celebrity.snippet},
                        Date: {S: dString}
                    };
                    put(paramsPUT);
                });
                //  console.log('CELEB',celebrity);
            })
        }
        // console.log("RESPONSE",response.data.results.bindings[0].personLabel.value);
        // console.log("RESPONSE",response.data.results.bindings[1].personLabel.value);
        // console.log("RESPONSE",response.data.results.bindings[2].personLabel.value);
        // console.log("RESPONSE",response.data.results.bindings[3].personLabel.value);
        // console.log("RESPONSE",response.data.results.bindings[4].personLabel.value);

    })
    .catch(function (error) {
        console.log(error);
    });

function clean(text, callback){
    let regExp = / *\([^)]*\) */g;
    // console.log('sasasasas',text.replace(regExp,' '));
    callback(text.replace(regExp,' '));
}
function findWiki(entry,callback){
    //   console.log('ENTRY',entry);
    for (var k = 0; k < entry.webPages.value.length; k++) {
        if(entry.webPages.value[k].displayUrl.includes('en.wikipedia')) {
            // console.log('wwww',k,entry.webPages.value[k].snippet);

            clean(entry.webPages.value[k].snippet, function(data){
                // console.log('ENT',data);
                callback(data);

            });
        }
    }
}
function realPerson(term, sex,age,label,done) {
    let https = require('https');
// Replace the subscriptionKey string value with your valid subscription key.
    let subscriptionKey = credentials.CSsubcriptionKey;

    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/search';

    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // console.log('\nRelevant Headers:\n');
            for (var header in response.headers)
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                   console.log(header + ": " + response.headers[header]);
            body = JSON.parse(body);
            console.log('\nJSON Response:\n');
            body.sex = sex;
            body.age = age;
            body.label = label;
            done(body);
        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    var bing_web_search = function (search) {
        //console.log('Searching the Web for: ' + search);
        let request_params = {
            method : 'GET',
            hostname : host,
            path : path + '?q=' + encodeURIComponent(search),
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
        };

        let req = https.request(request_params, response_handler);
        req.end();
    }

    if (subscriptionKey.length === 32) {
        bing_web_search(term);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }

}