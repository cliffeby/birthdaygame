/**
 * Created by cliff on 1/3/2018.
 */
function insert(arr,item) {
    if (arr.length <1) {
        arr.push(item);
        return arr;
    }
    for (var i = 0; i < arr.length; i++) {
        if (parseInt(item.wiki)<parseInt(arr[i].wiki)){
            console.log('TF',parseInt(item.wiki)<parseInt(arr[i].wiki), i);
            arr.splice(i,0,item);
            return arr;
        }
    }
    arr.push(item);
    return arr;
}
let celebs = [];
let item = [];
item[0] = {'Name':'High', 'wiki': '151'};
item[1] = {'Name': 'dn', 'wiki': '33'};
item[2] = {'Name': 'Low', 'wiki': '2222'};
item[3] = {'Name': 'ggg', 'wiki': '6'};
item[4] = {'Name': 'bbb', 'wiki': '2228'};
item[5] = {'Name': 'cc', 'wiki': '2223'};
console.log('ITEM',item);
for (var i = 0; i < item.length; i++) {
    insert(celebs, item[i]);
    // console.log('CELEBS',celebs);
}
console.log('celebs',celebs);