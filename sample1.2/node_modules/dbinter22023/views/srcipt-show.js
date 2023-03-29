var cnl_form = document.getElementById('cnl-form');
var del_form = document.getElementById('del-form');
var add_data = document.getElementById('add_data')
var title = document.getElementById('title');
var insert = document.getElementById('insert')
var insert_sec = document.getElementById('insert-sec')
var th = document.getElementsByClassName("theader")
var insert_input = document.getElementsByClassName('insert_input')
var table1 = document.getElementById('table1')
var db_list = document.getElementById('db_list')
var allcl = document.getElementsByClassName('table-entry')
var updatebox = document.getElementById("updatebox")
var box = document.getElementById("box")
var search_data = document.getElementById('search_data')
var select = document.getElementById('select')
var search_icon = document.getElementById('search-icon')
var cross_icon = document.getElementById('cross-icon')
var found_warn = document.getElementById('found')
cross_icon.style.display = 'none'
var selected_entry = "";
var len = allcl.length;
var prev_table_name = title.value;
var isprimaryKey = false;
var primarykey = "";
var scema;
var sc;
var input_count = 0;
var object_str = "";
var arr = [];
var select_old_column = '';
var entry_obj = null;
$('#col-edit').hide();

let server_url = localStorage.getItem("server_url");

async function DoAjaxCall(url, type, data) {
    console.log("Ajax call");
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

window.addEventListener("load", show3(prev_table_name));

function clickme(id) {
    if (id.value.trim() == null || id.value.trim() == "") {
        id.style.border = '2px red solid'
    } else {
        id.style.border = '1px black solid'
    }
    console.log('you click the some input');
}

add_data.onclick = async function () {
    arr = []
    var n = input_count / scema.length;
    console.log('btn press : ' + n);
    let i = 1;
    let sci = 0;
    let scema_length = scema.length;
    let err = false;
    for (let j = 1; j <= n; j++) {
        let obj = {};

        sci = 0;
        while (i <= scema_length) {
            var id = 'ipt' + i;
            console.log('id : ', id);
            let data = document.getElementById(id);
            let val = data.value.trim();
            if (val == "") {
                data.style.border = '2px  red solid'
                data.oninvalid
                err = true;
            } else {
                data.style.border = '1px black solid'
                let find = scema[sci];
                find = find['Field']
                obj[find] = val;
            }
            sci++;
            i++;
        }
        sci = 1;
        scema_length += scema.length;
        arr.push(obj)
    }
    if (!err) {
        let url = '/addMulData';
        let data = {
            table: prev_table_name,
            data: arr,
            size: n
        }
        DoAjaxCall(url, "post", data)
            .then((response) => {
                if (response == 'true')
                    window.location.reload()
                else {
                    if (confirm('primary key constraint violet at somewhere'))
                        window.location.reload()
                }
            })
    }
}

$(function () {
    let url = '/databases/';
    let type = 'get';
    let data = {
        checks: true
    }

    DoAjaxCall(url, type, data).then((databases) => { 
        var current_db = document.getElementById("db_list")[0].value; 
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
        })
    })
})

function db_click() {
    var selectBox = document.getElementById("db_list");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var url = server_url + '/' + selectedValue + "/db";
    window.location.href = url
}

DoAjaxCall('/table_/scema_', 'get', { table: prev_table_name })
    .then((data) => {
        scema = data;
})


insert.onclick = function () {
    console.log('scema', scema);
    console.log(typeof (scema));
    var tr = document.createElement('tr')
    var frm = document.createElement('form')
    // console.log(th);
    for (let i = 0; i < th.length; i++) {
        //   console.log();
        let td = document.createElement('td')
        let input = document.createElement('input')
        let type = scema[i].Type;
        if (type == 'timestamp')
            type = 'datetime-local'
        else if (type == 'int') {
            type = 'number'
        } else
            type = 'text'
        input.placeholder = 'Enter ' + th[i].innerText;
        input.style.height = 'inherit'
        input.setAttribute('type', type)

        input.setAttribute('class', 'insert_input')
        input_count++;
        var id_name = 'ipt' + input_count;
        input.id = id_name
        let click_str = "clickme(" + id_name + ")"
        input.setAttribute('oninput', click_str)
        input.required = "true"
        // input.setAttribute('oninvalid',"this.setCustomValidity('Please Enter valid email')")
        td.style.padding = '3px';
        // input.style.width=width; 
        td.appendChild(input)
        tr.appendChild(td)
        //    form.appendChild(td)
    }
    //    let wi=table1.clientWidth+'px'
    //    tr.style.width=wi
    // tr.appendChild(form)
    frm.appendChild(tr)
    table1.appendChild(frm)

    table1.appendChild(tr)
}

$('#co').click(function () {
    var sec = $('<div class="insert-sect">')
    scema.forEach(element => {
        // <input class="table-btn" required class="insert-data" name="{{d.Field}}" placeholder="{{d.Field}}"
        let insert = $('<input required name="' + element.Field + '" placeholder="' + element.Field + '">');
        sec.append(insert)
    });

    $('#insert-sec').append(sec)
    //   $('#form').append(sec)
    // s.appendChild(cr)
})

function hover() {
    $('#col-edit').show();
}

$('#col-edit').click(function () {
    var coln = document.getElementById(select_old_column);
    var new_col = document.getElementById(select_old_column).value;
    console.log('old : ', select_old_column);
    console.log('new : ', new_col);
    if (select_old_column != '') {
        var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        // console.log('old name',prev_table_name);
        if (format.test(new_col)) {
            document.getElementById(select_old_column).innerText = select_old_column;
            // $('#title').val(prev_table_name);
            $('.msg').text("can't use specical character like '-','/','\'");
            $('#alert-box').css('display', 'block');
            hide();
            $('#col-edit').hide()
        } else {
            // console.log('new table name',new_t_name);
            if (select_old_column == new_col) {
                $('.msg').text('Warning: table name not be same');
                $('#alert-box').css('display', 'block');
                hide();
            } else {
                var found = false;
                $.ajax('/table_/scema_', {
                    type: "get",
                    data: {
                        table: prev_table_name
                    }
                }).done(async function (res) {
                    // console.log(res);
                    await res.forEach(element => {
                        //    console.log(element.Tables_in_mytestdb);
                        if (element.Field == new_col) {
                            console.log('same name');
                            found = true;
                            $('.msg').text('Warning: This column name already exists');
                            $('#alert-box').show();

                            hide(prev_table_name);
                        }
                    })

                    if (found == false) {
                        $.ajax('/changeColumnName', {
                            type: "get",
                            data: {
                                table: prev_table_name,
                                prev_name: select_old_column,
                                new_name: new_col,
                            }
                            //  title.innerText=data;  
                        }).done(function (res) {
                            console.log('ajax coln name change res receives', res);
                            if (res != 'error') {
                                // prev_table_name = new_t_name;
                                // $('#title').val(new_t_name);
                                $('#change-btn').hide();
                                $('.msg').text('column name successfully changes');
                                $('#alert-box').show();
                                $('#col-edit').hide();

                                var url = server_url + '/table/' + prev_table_name + "/";
                                setInterval(function () {
                                    window.location.href = url
                                }, 2000)

                            } else {
                                $('#title').val(prev_table_name);
                                $('.msg').text('error occur please try after sometime');
                                $('#alert-box').show();
                                $('#col-edit').hide()
                                hide();
                            }
                        }).fail(function (res) {
                            window.Error("currently you can't change name please try after sometime")
                        })
                    }
                })
            }
        }
    }
})

function colums(id) {
    select_old_column = id; 
    var old_valueofcol = id;

    $('#col-edit').show(); 
}

window.addEventListener('load', function () { 
    var len = title.value.length;
    var w = len * 32;
    w += "px";
    title.style.width = w;
    $('#change-btn').hide();
})

title.onhover = function () { 
    var len = title.value.length;
    var w = len * 32;
    w += "px";
    title.style.width = w;
}

$('#title').click(function () {
    $('#change-btn').show();
})
// title.addEventListener('clicked',function(){
//     $('#change-btn').show();
// })
// $('#title').visited(function(){
//     $('#change-btn').show();
// })

// title.addEventListener("mouseout",()=>{
//     $('#change-btn').hide();
// });

title.addEventListener("mouseover", () => {
    $('#change-btn').show();
});

// title.addEventListener('onVisited',()=>{
//     $('#change-btn').show();
// });


window.addEventListener("click", function () {
    // document.getElementById("demo").innerHTML = sometext;
    $('#change-btn').hide();
    $('#col-edit').hide();
});


$('#change-btn').click(async function () {
    var format = `/^[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]*$/`;
    var new_t_name = String(title.value).trim();
    var is_special_char = false;
    for (i = 0; i < format.length; i++) {
        if (new_t_name.indexOf(format[i]) > -1) {
            is_special_char = true;
            break;
        }
    }
    if (is_special_char) {
        $('#title').val(prev_table_name);
        $('.msg').text("can't use specical character");
        $('#alert-box').css('display', 'block');
        hide()
        $('#change-btn').hide()
        return;
    } else {
        // console.log('new table name',new_t_name);
        if (new_t_name == prev_table_name) {
            $('.msg').text('Warning: table name not be same');
            $('#alert-box').show();
            hide();
        } else {
            var found = false;
            let url = "/getalltable"
            DoAjaxCall(url, "get")
                .then(async function (res) {
                    await res.forEach(element => {
                        if (element.Tables_in_mytestdb == new_t_name) {
                            found = true;
                            $('.msg').text('Warning: This table name already exists');
                            $('#alert-box').show();
                            hide();
                        }
                    })

                    if (found == false) {

                        let url = '/changeName';
                        let data = {
                            prev_name: prev_table_name,
                            new_name: new_t_name,
                        }

                        DoAjaxCall(url, "get", data)
                            .then(function (res) {
                                console.log(res);
                                if (res != 'error') {
                                    prev_table_name = new_t_name;
                                    // $('#title').val(new_t_name);
                                    $('#change-btn').hide();
                                    $('.msg').text('table name successfully changes');
                                    $('#alert-box').show();
                                    $('#change-btn').hide();

                                    var url = 'http://localhost:7870/table/' + new_t_name + "/";
                                    setInterval(function () {
                                        window.location.href = url
                                    }, 2000)

                                } else {
                                    $('#title').val(prev_table_name);
                                    $('.msg').text('error occur please try after sometime');
                                    $('#alert-box').css('display', 'block');
                                    hide()
                                    $('#change-btn').hide()
                                }
                            }).catch(function (res) {
                                window.Error("currently you can't change name please try after sometime")
                            })
                    }
                })
        }
    }
})

function hide() {
    console.log('it came to hide func');
    var url = server_url + '/table/' + prev_table_name + "/";
    setInterval(function () {
        $('#alert-box').css('display', 'none');
        window.location.href = url
    }, 3000)
}

del_form.addEventListener('submit', function (e) {
    if (confirm('Are you sure you delete the data') == false)
        e.preventDefault();
    else {
        alert('your table data deleted')
    }
})

cnl_form.addEventListener('submit', function (e) {
    if (confirm('Are you sure you delete the table , you will lost the all data') == false)
        e.preventDefault();
    else {
        alert('your "' + prev_table_name + '" table is deleted')
        setTimeout({
        }, 2000)
    }

})

for (let i = 0; i < len; i++) {
    var charlen = allcl[i].value;
    //    console.log('length : ',charlen.length);
    var w = charlen.length * 14;
    w += "px";
    let col = document.getElementById(allcl[i].value);
    //    console.log(col);
    col.style.width = w;
}


function update(col, data) {
    console.log(col.value);
    console.log(col, data);
}

async function show3() {
    table1.style.display = 'block'
    table1.innerHTML = ""
    found_warn.style.display = 'none'

    let url = '/table_/scema_';
    let data = {
        table: prev_table_name
    }

    DoAjaxCall(url, 'get', data)
        .then(async (data) => { 
            sc = data;
            select.innerHTML = ""
            let option = document.createElement("option")
            option.innerText = "Search by"
            option.value = "1"
            option.selected = true;
            select.appendChild(option)
            // <option value="1" selected="selected">Search by</option>
            scema = data;
            // console.log("scama : ", data);
            var tr = document.createElement('tr')
            var tr_type = document.createElement('tr')
            tr_type.setAttribute('id', 'data_type')
            await data.forEach(element => {
                // console.log(element.Type); 
                let option = document.createElement('option')
                option.innerText = element.Field; 
                select.appendChild(option)
                var th_type = document.createElement('th')
                th_type.innerText = element.Type;
                var th = document.createElement('th')
                th.setAttribute('class', 'theader')
                th.innerText = element.Field;
                if (element.Key == "PRI") {
                    isprimaryKey = true;
                    primarykey = element.Field;
                    th.style.backgroundColor = 'rgb(162 205 245 / 86%)'
                }
                // console.log(element.Field);
                tr_type.appendChild(th_type)
                tr.appendChild(th)

            });
            table1.appendChild(tr_type)
            table1.appendChild(tr);

        })
        .catch(function (data) {
            console.log(data);
            let url = server_url + '/auth/'
            window.location.href = url;
        });

    url = '/table_/data_';
    data = {
        table: prev_table_name
    }

    DoAjaxCall(url, 'get', data)
        .then(async function (res) {
            await res.forEach(element => {
                let tr = document.createElement('tr')
                const subdata = JSON.stringify(element);
                tr.setAttribute('onclick', 'updateBox(' + subdata + ')')
                sc.forEach(element1 => {
                    let td = document.createElement('td')
                    let field = element1.Field
                    // console.log('fiel', field);
                    td.innerText = element[field];
                    tr.appendChild(td)
                });
                table1.appendChild(tr);
            });
        })
        .catch(function (res) {
            console.error('fail to connect ajax req to server');
            let url = server_url + '/auth/'
            window.location.href = url;
        });

}

$('body').on("click", '#btnexport', function () {
    console.log('click the button');
    html2canvas($('#table1')[0], {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download(prev_table_name);
        }
    });
});

async function updateBox(arg) {
    selected_entry = arg
    let i = 1;
    // updatebox.style.display=none;
    updatebox.style.visibility = 'visible'
    box.innerHTML = ""

    let data_box = document.createElement("div")
    data_box.setAttribute('id', 'head-box')
    data_box.setAttribute('class', 'data_box');

    let field = document.createElement("div")
    field.className = "fields"
    field.innerText = "Field";

    let sym = document.createElement("div")
    sym.setAttribute('class', 'sym');
    sym.innerText = " "

    let value = document.createElement("input")
    value.className = "values"
    value.setAttribute("id", 'val-head')
    value.value = "Value";

    data_box.appendChild(field);
    data_box.appendChild(sym);
    data_box.appendChild(value);

    box.appendChild(data_box)

    scema.forEach(element => {
        let data_box = document.createElement("div")
        data_box.setAttribute('class', 'data_box');

        let field = document.createElement("div")
        // field.setAttribute('class',  'fields');
        field.className = "fields"
        field.innerText = element.Field;
        // field.disabled=true;

        let sym = document.createElement("div")
        sym.setAttribute('class', 'sym');
        sym.innerText = ":"

        let value = document.createElement("input")
        value.className = "values"
        value.value = arg[element.Field];
        let id = 'upd_ipt' + i;
        value.setAttribute('id', id)
        value.setAttribute('onClick', "this.select()");
        i++;
        data_box.appendChild(field);
        data_box.appendChild(sym);
        data_box.appendChild(value);

        box.appendChild(data_box)
    });

    if (!isprimaryKey)
        entry_obj = arg;
    else {
        let str = {
            primarykey: arg[primarykey]
        }
        entry_obj = str;
    }
}

async function cancel() {
    updatebox.style.visibility = 'hidden'
}

const wrapper = document.querySelector(".wrapper"),
    header = wrapper.querySelector("header");

function onDrag({ movementX, movementY }) {
    let getStyle = window.getComputedStyle(wrapper);
    let leftVal = parseInt(getStyle.left);
    let topVal = parseInt(getStyle.top);
    wrapper.style.left = `${leftVal + movementX}px`;
    wrapper.style.top = `${topVal + movementY}px`;
}

header.addEventListener("mousedown", () => {
    header.classList.add("active");
    header.addEventListener("mousemove", onDrag);
});

document.addEventListener("mouseup", () => {
    header.classList.remove("active");
    header.removeEventListener("mousemove", onDrag);
});

async function update() {
    let len = scema.length;
    let update_entry = [];
    for (let i = 1; i <= len; i++) {
        let id = 'upd_ipt' + i;
        let subdata = document.getElementById(id).value;
        update_entry.push(subdata);
    };

    let url = server_url + '/%entry_update%/'
    let data = {
        table_name: prev_table_name,
        isprimaryKey: isprimaryKey,
        primarykey: primarykey,
        update_entry: update_entry,
        scema: scema,
        entry_obj: entry_obj
    }

    DoAjaxCall(url, "post", data)
        .then(function (res) {
            console.log(res);
            updatebox.style.visibility = 'hidden'
            if (res == 'deleted') {
                $('.msg').text('entry updated successfully');
                $('#alert-box').show();
                show3()
                setInterval(function () {
                    $('#alert-box').css('display', 'none');
                }, 3000)

            } else {
                console.log(res.sqlMessage);
                $('.msg').text(res.sqlMessage);
                $('#alert-box').show();
                hide();
            }
        })
}

async function delete_entry() {
    let url = server_url + '/%entry_delete%/'

    let data = {
        table_name: prev_table_name,
        isprimaryKey: isprimaryKey,
        primarykey: primarykey,
        entry_obj: entry_obj,
        scema: scema
    }

    DoAjaxCall(url, 'post', data).then((data) => {
        updatebox.style.visibility = 'hidden'
        if (data == 'deleted') {
            $('.msg').text('entry deleted successfully');
            $('#alert-box').show();
            show3()
            setInterval(function () {
                $('#alert-box').css('display', 'none');
            }, 3000)
        } else {
            $('.msg').text(data.sqlMessage);
            $('#alert-box').show();
            hide();
        }
    })
}

search_icon.onclick = function () {

    let search_by = document.getElementById('select').value
    if (search_by == 1) {
        document.getElementById('select').style.border = '1px solid red'
    } else {
        document.getElementById('select').style.border = '1px solid black'

        let search = search_data.value

        let data = {
            table: prev_table_name,
            search_by: search_by,
            search: search
        }

        DoAjaxCall('/data_search', 'get', data)
            .then(function (res) {
                console.log(res);
                if (res == 'Not Found') { } else {
                    found_warn.style.display = 'none'
                    show_search_data(res)
                }
            })
        search_icon.style.display = 'none'
        cross_icon.style.display = 'inline'
    }
}

cross_icon.onclick = function () {
    show3()
    search_data.value = ""
    found_warn.style.display = 'none'
    document.getElementById('select').value = "1"
    search_icon.style.display = 'inline'
    cross_icon.style.display = 'none'

}

search_data.addEventListener('input', (e) => {
    search_icon.style.display = 'inline'
    cross_icon.style.display = 'none'
})

async function show_search_data(update_data) {

    table1.style.display = 'block'
    table1.innerHTML = ""
    var tr = document.createElement('tr')
    var tr_type = document.createElement('tr')
    tr_type.setAttribute('id', 'data_type')
    await scema.forEach(element => {
        var th_type = document.createElement('th')
        th_type.innerText = element.Type;
        var th = document.createElement('th')
        th.setAttribute('class', 'theader')
        th.innerText = element.Field;
        if (element.Key == "PRI") {
            isprimaryKey = true;
            primarykey = element.Field;
            th.style.backgroundColor = 'rgb(162 205 245 / 86%)'
        }
        tr_type.appendChild(th_type)
        tr.appendChild(th)
    });
    table1.appendChild(tr_type)
    table1.appendChild(tr);

    if (update_data.length == 0)
        found_warn.style.display = 'block'
    else {
        await update_data.forEach(element => {
            let tr = document.createElement('tr')
            const subdata = JSON.stringify(element);
            tr.setAttribute('onclick', 'updateBox(' + subdata + ')')
            sc.forEach(element1 => {
                let td = document.createElement('td')
                let field = element1.Field
                td.innerText = element[field];
                tr.appendChild(td)
            });
            table1.appendChild(tr);
        });
    }
}

select.addEventListener("change", function () {
    let search_by = select.value;

    scema.forEach(element => {

        if (element.Field == search_by) {
            $('#search_data').val("");
            if (element.Type.includes('int'))
                $('#search_data').attr('type', 'number');
            else if (element.Type == "timestamp")
                $('#search_data').attr('type', 'date');
            else
                $('#search_data').attr('type', 'text');

        }
    });
});

function copy() {
    let str = JSON.stringify(selected_entry)
    console.log('selected_entry : ', str);
    navigator.clipboard.writeText(str);

    alert("Copied the text: " + str)
}