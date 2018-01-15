/**
 * Created by cliff on 12/22/2017.
 */
var d = addDays(new Date(),0);
console.log('Date',d.getDate());
console.log('Date',d.getMonth());
console.log('Date',d);

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
console.log('d4',addDays(d,4));

var msec = Date.parse("March 21, 2012");
var d = new Date(msec);
console.log('DDDTTTT',d, d.toISOString());
console.log('DD', d.toISOString().substring(0,10));