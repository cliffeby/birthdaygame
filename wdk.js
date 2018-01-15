/**
 * Created by cliff on 10/24/2017.
 */
const wdk = require('wikidata-sdk');
const entry1 = require('./entry1.json');
const entry2 = require('./entry2.json');
const entry3 = require('./entry3.json');
let entry=[];
entry[0] = entry1;
entry[1] = entry2;
entry[2] = entry3;

var d = addDays(new Date(),2);
console.log('Date',d.getDate());
console.log('Date',d.getMonth());
day = d.getDate();
month = d.getMonth() + 1;

function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
}
// const simplifiedResults = wdk.simplifySparqlResults(results)
const axios = require('axios');
const authorQid = 'Q535'
const sparql = `
SELECT DISTINCT (YEAR(?date) AS ?year) ?personLabel ?personDescription ?sexLabel WHERE {
  ?person wdt:P569 ?date.
  ?person wdt:P21 ?sex.
  { ?person wdt:P106 wd:Q3665646. }
  UNION
  { ?person wdt:P106 wd:Q5369. }
  UNION
  { ?person wdt:P106 wd:Q19204627. }
  UNION
  { ?person wdt:P106 wd:Q33999. }
  OPTIONAL { ?person wdt:P27 wd:Q30. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  FILTER((YEAR(?date)) > 1930)
  FILTER(((MONTH(?date)) = `+ month +`)&& ((DAY(?date)) = `+day+`))
}
LIMIT 10
`
console.log('spar',sparql);
const url = wdk.sparqlQuery(sparql);
let celebrity = {};
let celebrities=[];
axios.get(url)
    .then(function (response) {
            for (var i = 0; i < 3; i++) {
                    // for (var i = 0; i < response.data.results.bindings.length; i++) {

                    celebrity.sex = response.data.results.bindings[i].sexLabel.value;
                    celebrity.age = 2017- response.data.results.bindings[i].year.value;
                        getSnippet(response,i, function(datagS){
                            celebrity.presence = datagS.webPages.totalEstimatedMatches;

                            findWiki(datagS, function(snippet){
                                   // console.log('responseWiki', response);
                                //     celebrity.name = response.data.results.bindings[i].personLabel.value;
                                    celebrity.snippet = snippet;
                                    celebrities.push(celebrity);
                                    console.log('CELEB',celebrity);
                            });
                          //  console.log('CELEB',celebrity);
                    })
            }
            console.log("RESPONSE",response.data.results.bindings[0].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[1].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[2].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[3].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[4].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[5].personLabel.value);
            console.log("RESPONSE",response.data.results.bindings[0]);
    })
    .catch(function (error) {
        console.log(error);
    });
function getSnippet(person,i, callback){
        var timer = setTimeout(function()
        {
                // console.log('PERSON/TERM',person);
                person = entry[i];
                callback(person);
        }, 3000)
}
function clean(text, callback){
        let regExp = / *\([^)]*\) */g;
        // console.log('sasasasas',text.replace(regExp,' '));
        callback(text.replace(regExp,' '));
}
function findWiki(entry,callback){
     //   console.log('ENTRY',entry);
        for (var k = 0; k < entry.webPages.value.length; k++) {
            if(entry.webPages.value[k].displayUrl.includes('wikipedia')) {
                // console.log('wwww',k,entry.webPages.value[k].snippet);

                clean(entry.webPages.value[k].snippet, function(data){
                        // console.log('ENT',data);
                 callback(data);

                });
                }
        }
}
function realPerson(term) {
        let https = require('https');
    const credentials = require('./credentials.json');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
        let subscriptionKey = credentials.CSsubcriptionKey;

// Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
// search APIs.  In the future, regional endpoints may be available.  If you
// encounter unexpected authorization errors, double-check this host against
// the endpoint for your Bing Web search instance in your Azure dashboard.
        let host = 'api.cognitive.microsoft.com';
        let path = '/bing/v7.0/search';

       // let term = 'Boyd Rice';

        let response_handler = function (response) {
                let body = '';
                response.on('data', function (d) {
                        body += d;
                });
                response.on('end', function () {
                        console.log('\nRelevant Headers:\n');
                        for (var header in response.headers)
                            // header keys are lower-cased by Node.js
                                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                                        console.log(header + ": " + response.headers[header]);
                        body = JSON.stringify(JSON.parse(body), null, '  ');
                        console.log('\nJSON Response:\n');
                        console.log(body);
                });
                response.on('error', function (e) {
                        console.log('Error: ' + e.message);
                });
        };

        let bing_web_search = function (search) {
                console.log('Searching the Web for: ' + term);
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