/**
 * Created by cliff on 12/22/2017.
 */
var snippet = ['Kurt Schumacher is a former American football guard and tackle in the National Football League for the New Orleans Saints and the Tampa Bay ...',
    'Julio Mairini Linares Rijo is the special advisor, Latin American player development, for the Houston Astros of Major League Baseball and a ...',
    'Robert Myers is an American football guard who is currently a free agent. He played college football at Tennessee State, and was drafted by ...'];
var name = ['Kurt Schumacher', 'Julio Linares',  'Robert Myers' ];
var gender = ["F", "M", "M"]
var pronoun;
for (var i = 0; i < 3; i++) {
    if (gender[i] =="M"){
        pronoun = "He";
    } else{
        pronoun = "She";
    }
    snippet[i] =snippet[i].replace(name[i], pronoun);

    console.log('SNIP',snippet[i]);
}
