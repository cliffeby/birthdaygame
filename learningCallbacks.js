/**
 * Created by cliff on 12/18/2017.
 */
function one(person, callback){
    var timer = setTimeout(function()
    {
        person.Name.Nick = person.Name.Nick + "001";
        callback(person);
    }, 500)
}
function two(person, callback){
    var timer = setTimeout(function()
    {
        person.Age = 21
        callback(person);
    }, 1000)
}
function peeps(callback){
    var timer = setTimeout(function()
    {
        people = [{"Name": {'Nick':'Joe','Real':'Joseph'}, 'Age': 55},
            {'Name': {'Nick':'Joe1','Real':'Joseph1'},'Age':45},
            {'Name': {'Nick':'Joe2','Real':'Joseph2'}, 'Age':22}]
        for (var x in people){
            console.log('X',people[x]);
        }
        callback(people);
    }, 3000)
}

people = peeps(function(cb2) {
    for (var i = 0; i < cb2.length; i++) {

        one(cb2[i], function (callback) {
            two(callback, function (cb) {
                console.log('Dat', cb.Age, callback.Age);
                console.log('Da', callback);
            })
        })
    }
    console.log('cb2', cb2);
})
