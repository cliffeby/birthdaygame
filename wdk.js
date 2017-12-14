/**
 * Created by cliff on 10/24/2017.
 */
const wdk = require('wikidata-sdk');

// const simplifiedResults = wdk.simplifySparqlResults(results)
const axios = require('axios');
const authorQid = 'Q535'
const sparql = `
SELECT DISTINCT  ?personLabel (YEAR(?date) AS ?year) ?personDescription ?article ?cid
WHERE {
  BIND(MONTH(NOW()) AS ?nowMonth)
  BIND(DAY(NOW()) AS ?nowDay)
  ?person wdt:P569 ?date.
  ?person wdt:P21 wd:Q6581097.
  {?person wdt:P106 wd:Q3665646.} 
  
  UNION
  { ?person wdt:P106 wd:Q5369. }
  UNION
  { ?person wdt:P106 wd:Q19204627. }
  UNION
  { ?person wdt:P106 wd:Q33999. }
 
    OPTIONAL {

      ?person wdt:P27 wd:Q30. 
      ?article schema:about ?person .
      ?article schema:inLanguage "en" .
    }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  FILTER (SUBSTR(str(?article), 1, 25) = "https://en.wikipedia.org/")
  FILTER((YEAR(?date)) > 1940)
  FILTER(((MONTH(?date)) = ?nowMonth) && ((DAY(?date)) = ?nowDay))
}
ORDER BY DESC(?rank)
LIMIT 20
`
const url = wdk.sparqlQuery(sparql);

// const https = require('https');
// var resp1 = '';
// https.get(url, function(resp) {
//     resp.on('data', function (chunk) {
//         resp1 += chunk;
//         console.log("RESPONSE", resp1);
//     });
// });
axios.get(url)
    .then(function (response) {
        console.log('FULL RESPONSE',response);

        console.log("RESPONSE",response.data.results.bindings[0].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[0].personDescription.value);
        console.log("RESPONSE",response.data.results.bindings[1].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[2].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[3].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[4].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[5].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[6].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[6].personDescription.value);
        console.log("RESPONSE",response.data.results.bindings[7].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[8].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[9].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[10].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[11].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[12].personLabel.value);
        console.log("RESPONSE",response.data.results.bindings[12].personDescription.value);
    })
    .catch(function (error) {
        console.log(error);
    });
