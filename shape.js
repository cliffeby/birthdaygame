/**
 * Created by cliff on 12/17/2017.
 */
const entry1 = require('./entry1.json');
const entry2 = require('./entry2.json');
const entry3 = require('./entry3.json');
let celebrity ={};
let celebrities=[];
let entry =[];
entry[0] = entry1;
entry[1] = entry2;
entry[2] = entry3;
// console.log('e1',entry[1].webPages.value[2].snippet);
for (var i = 0; i < entry.length; i++) {

        for (var k = 0; k < entry[i].webPages.value.length; k++) {
            if(entry[i].webPages.value[k].displayUrl.includes('wikipedia')) {
                // console.log('wwww',i,k,entry[i].webPages.value[k].snippet);
                celebrity.name = entry[i].queryContext.originalQuery;
                celebrity.presence =entry[i].webPages.totalEstimatedMatches;

                clean(entry[i].webPages.value[k].snippet, function(data){
                    celebrity.snippet = data;
                    celebrities.push(celebrity);
                    console.log('CEL',celebrity);
                });
                }
        }
}
// console.log('All',celebrities);

function clean(text, callback){
    let regExp = / *\([^)]*\) */g;
    // console.log('sasasasas',text.replace(regExp,' '));
    callback(text.replace(regExp,' '));
}