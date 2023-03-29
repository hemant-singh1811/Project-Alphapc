var warn = document.getElementById('warn')
var btn = document.getElementById('add');
var create_btn = document.getElementById('create_btn')
var col = document.getElementById('col');
var del = document.getElementById('del')
var cols = document.getElementById('cols');
var tcol = document.getElementById('tcol');
var form = document.getElementById('form');
var create = document.getElementById('btn');
var type = document.getElementById('type');
var table = document.getElementById('table');
var total = document.getElementById('i');
var table_name = document.getElementById('table_name');
var add_table_btn = document.getElementById('add-table');
var add_section = document.getElementById('section');
var hide = document.getElementById('hide')
var creation_section = document.getElementById('creation_section')
var table_section = document.getElementsByClassName('table-section');
var create_cont = document.getElementById('create_cont')
var db = document.getElementById("db")
var all_tables;
const map = new Map();
var i = 0;
var option = ['Number', 'Charcters', 'date']
var box;

hide.style.visibility = "hidden"
add_section.style.visibility = "hidden"


function clic(table_name) {
    var btn = document.getElementById(table_name);
    console.log('you click the button');
    console.log(table_name);
    // var url = 'http://localhost:7878/table/' +  table_name + "/";
    // setInterval(function () {
    // console.log('url',url);
    // window.location.href = url
    // }
    // , 2000)
}

// $(function(){
//     let url='form_url';
//     $.ajax(url, {
//         type: 'get', 
//     }).done(function (form_url) {

//     })
// })

console.log(db.className);

let url = "/" + db.className + "/db";
console.log('url', url);

async function DoAjaxCall(url, type, data) {
    console.log("Ajax call", 'background: #222; color: #bada55');
    return new Promise(function (resolve, reject) {
        $.ajax(url, {
            type: type,
            data: {
                ...data,
            }
        }).done(function (response) {
            resolve(response);
        }).fail((err) => {
            reject(err);
        })
    })
}


DoAjaxCall(url,"get",{ checks: 'true'})
.then(function(res) {
    console.log("all tables ", res);
    all_tables = res;
})

// table_name.addEventListener('input',(e)=>{
//     var val=table_name.value.trim();
//     console.log("val : ",val);
//     var match=false;
//      all_tables.forEach(element => {

//          if(element.Tables_in_mytestdb==val){
//             warn.style.visibility='visible'
//             match=true;
//             create_btn.disabled = true;
//          }
//      });
//      if(!match) { 
//          warn.style.visibility='hidden'
//          create_btn.disabled = false;
//     //   form.action='/create';
//     }
// })

let colmap = new Map();
let duplicate = false;

// form.addEventListener('input', (e) => {
//     console.log(e);
//     console.log(document.getElementById('form'));
//     e.preventDefault();
//     console.log('yes it triggered');
//     duplicate = false;
//     colmap = new Map();
//     console.log('clicke on tfform ');

//     for (let j = 1; j <= i; j++) {
//         let id = 'ipt' + j;
//         let col_name = document.getElementById(id).value;

//         if (colmap.has(col_name)) {
//             duplicate = true;
//             document.getElementById(id).style.border = '1px solid red'
//             document.getElementById(colmap.get(col_name)).style.border = '1px solid red'
//             document.getElementById(id).setCustomValidity('column name should be diffrent');
//             document.getElementById(colmap.get(col_name)).setCustomValidity('column name should be diffrent');
//             console.log('same column');
//         } else {
//             document.getElementById(id).style.borderBlockColor = '1px solid black'
//             colmap.set(col_name, id);
//         }
//     }

//     if (duplicate == false) {
//         console.log('its diffrent');
//         $('form').unbind('submit');
//     } else {

//     }
// })

form.addEventListener('input', (e) => {
    var col_name_map = new Map();
    var val = table_name.value.trim();
    var found = false;
    console.log('table name:', val);
    all_tables.forEach(element => {
        if (element.Tables_in_mytestdb == val) {
            found = true;
            warn.style.visibility = 'visible'
            e.preventDefault();
            create_btn.disabled = true;
        }
    });
    if (!found) {
        create_btn.disabled = false;
        warn.style.visibility = 'hidden'
    }
    create_btn.onclick = function() {
        console.log(warn.style.display);
        if (found) {
            e.preventDefault();
            error.style.border = '1px red solid'
        } else {
            console.log('you click the button');
        }
    }
})

add_table_btn.onclick = function() {
    if (add_section.style.visibility == 'hidden') {
        create_cont.style.display = 'flex'
        creation_section.style.display = 'block'
        add_table_btn.style.visibility = "hidden"
            // table_section.style.visibility='visible';
        add_section.style.visibility = "visible";
        hide.style.visibility = "visible";
        $('.table-section').show();
        window.scrollBy(0, 900);
    }

}

hide.onclick = function() {
    creation_section.style.display = 'none'
    add_section.style.visibility = "hidden"
    add_table_btn.style.visibility = "visible"
    hide.style.visibility = "hidden";
    $('.table-section').hide();
    // table_section.style.visibility="hidden";
}

// cols.style.visibility='hidden';
// table.style.visibility='hidden';
// import {gettable} from '../DB/db.js';
// var pretable=document.getElementById('pre-table');

// let task=async()=>gettable((d)=>{
//     d.forEach(el => {
//         var div=document.createElement('div');
//         div.textContent=el.Tables_in_mytestdb;
//         pretable.appendChild(div);
//     });
// })


// task();



btn.onclick = function() {
    i++;
    var BOX = document.createElement("div");
    table.style.visibility = 'visible';
    cols.style.visibility = 'visible';
    //   window.scrollBy(0,50)
    // var cols=document.createElement
    console.log('you clicking the button');
    var INPUT = document.createElement("INPUT");
    var TYPE = document.createElement('select');
    var radio = document.createElement('input')
    option.forEach(e => {
        var typ = document.createElement("option");
        typ.text = e;
        TYPE.add(typ);
    });
    radio.setAttribute('type', 'radio')
    let radio_name = 'radio' + i;
    radio.setAttribute('name', 'radio');
    radio.setAttribute('id', radio_name)
    radio.setAttribute('class', 'radio');
    radio.value = i;
    INPUT.setAttribute("type", "text");
    INPUT.style.textTransform = "uppercase"
    var ipt = "ipt" + i;
    var types = 'TYPE' + i;
    INPUT.setAttribute('id', ipt);
    TYPE.setAttribute('id', types);
    TYPE.required = true;
    INPUT.required = true;
    TYPE.style.margin = '5px';
    TYPE.style.border = '2px #8f9e9e solid';
    INPUT.setAttribute('name', ipt);
    TYPE.setAttribute('name', types);
    TYPE.style.display = 'block';
    INPUT.style.display = 'inline-block';
    BOX.appendChild(TYPE);
    BOX.appendChild(radio)
        // console.log("INPUT id : " + INPUT.id);
    BOX.appendChild(INPUT);
    BOX.style.margin = '4px'
    BOX.style.border = '2px #8f9e9e solid';
    BOX.style.display = 'inline-block'
    BOX.style.margin = '10px'
    TYPE.style.margin = '10px';
    //    cols.style.border='2px black solid';
    box = 'box' + i;
    BOX.setAttribute('id', box);
    // console.log('BOX : ' + box);
    BOX.style.marginLeft = '5px'
    BOX.style.padding = '5px'
        // di.style.textAlign='center'

    // cols.style.margin='auto';
    BOX.style.backgroundColor = '#d4caca';
    cols.style.backgroundColor = 'rgb(214 223 232 / 56%)';
    cols.style.textAlign = 'center';
    cols.style.border = '2px black solid;'
    cols.appendChild(BOX);
    tcol.value = i.toString();
    total.setAttribute('name', 'total')
    total.textContent = i;
}

del.onclick = function() {
    if (i > 0) {
        // console.log('last di id : ' + box);
        var myobj = document.getElementById(box);

        // console.log('i before :' + i);
        myobj.remove();
        i = i - 1;
        // console.log('i after :' + i);
        box = 'box' + i;
        // console.log('last di id : ' + box);
    }
    total.textContent = i;
    tcol.value = i.toString();

    if (i == 0) {
        console.log("table name", table_name.value);
        // var nul="";
        table_name.value = "";
        cols.style.visibility = 'hidden';
        table.style.visibility = 'hidden';
        cols.style.border = '0';
    }
}

$(function() { 


    DoAjaxCall('/databases/',"get",{ checks: 'true'})
        .then(function(databases) { 
            var current_db = document.getElementById("db_list")[0].value;
            console.log('current db', current_db);
            databases.forEach(element => {
                if (element != current_db) {
                    let option = document.createElement('option')
                    option.innerText = element
                        //   var click='/'+element+'/db'
                        //   var link="db_click("+"'"+click+"'"+')'
                        //   console.log(link);
                        //   option.setAttribute('onclick',link);
                    db_list.appendChild(option)
                }
            });
        })
})

function db_click() {
    //   console.log('link : ',link);
    var selectBox = document.getElementById("db_list");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    console.log(selectedValue);
    var url = 'http://localhost:7870/' + selectedValue + "/db";
    window.location.href = url
}

// form.addEventListener('click', (e) => {
//     // create.onclick=function(){
//     console.log('inside the event listener');
//     for (let j = 1; j <= i; j++) {
//         var s = 'ipt' + j;
//         console.log("form s : " + s);
//         var alet = document.getElementById(eval(s));
//         if (alet.value != "" && alet.value != null) {
//             if (!map.has(alet.value)) {
//                 map.set(s, 1);
//             } else {
//                 e.preventDefault;
//                 window.alert('every column name should by unique')

//                 alet.style.border = '2px red solid';
//             }
//         }

//     }

// }
// })

// var pretable=document.getElementById('pre-table');
//   // console.log('this is ');
//   gettable().then((d)=>{
//       d.forEach(el => {
//           var div=document.createElement('div');
//           div.textContent=el.Tables_in_mytestdb;
//           pretable.appendChild(div);
//       });
//     })