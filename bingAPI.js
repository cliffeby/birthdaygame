/**
 * Created by cliff on 12/19/2017.
 */
const credentials = require('./credentials.json');
var Bing = require('node-bing-api')({ accKey:credentials.accKey })


Bing.web("Pizza", {
    count: 10,  // Number of results (max 50)
    offset: 2   // Skip first 3 results
}, function(error, res, body) {
    // body has more useful information besides web pages
    // (image search, related search, news, videos)
    // but for this example we are just
    // printing the first two web page results
    console.log(body);
    //   console.log('BODY', body);
});

// Bing.web("Ninja Turtles", {
//     count: 15,   // Number of results (max 50)
//     offset: 3    // Skip first 3 result
// }, function(error, res, body){
//     console.log(body);
// });