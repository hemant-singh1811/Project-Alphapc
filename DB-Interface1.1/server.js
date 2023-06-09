const express = require('express');
const open = require('open');
const { get_DataBases, auth, delete_entry, search_data, connection, update_data, db_connect, create, gettable, select, scema, changeColumnName, insert, deletetable, dropalldata, changeName, logout } = require('./db_helpers')
const server = express();
require("dotenv").config();
const apiroutes = require('./api');
const routes=require("./REST/api");

var logged = false
var scem;
var table;
var emt;
var selected_db;
var urls;
var currentpage=-1;


let port = process.env.port || 8082

server.set('view engine', 'hbs');
server.use(express.static(__dirname + '/views'));
server.set('views', __dirname + '/views')
server.use(express.json())
server.use(express.urlencoded({ extended: true }));
server.use(headss);

async function headss(req,res,next){
    // console.log(req.method);

    if(req.method=='GET'){
        // req.redirect('')
        next()
    }else{
        // console.log("url : ",req.url);
        // console.log("path  :",req.path);
        // req.url='/api'+req.path;
        // console.log("path  :",req.path);
        next();
    }
}

// auth - 0;
// databases - 1 ;
// 1++;
// 1--;
// server.use("/api", apiroutes);

server.use('/api',routes)

server.get('/', (req, res) => {
    res.redirect('/auth')
})

server.get('/auth/', async (req, res) => {

    console.log("logged status : ", logged);

    if (logged) {

    } else {
        let file = __dirname + '/views/auth/login.html';
        logged = false

        await auth('xxx')
        .then((d) => {
        })
        .catch((e) => {
        })

        res.sendFile(file)
    }
})

server.get('/databases/', async (req, res) => { 
    if (!logged)
        res.redirect('/auth')
    else {
        const system_databases = ["information_schema", "sys", "performance_schema", "mysql"];
        let check = req.query.checks;
        get_DataBases()
            .then((data) => {
                if (check)
                    res.send(data)
                else
                    res.render('databases.hbs', { server: "http://localhost:" + port, databases: data, sys_databases: system_databases });
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

server.get('/tabless', async (req, res) => {
    console.log("hits tabless");
    let db = req.query.db;
    res.redirect('/db')
})

server.get('/:name/db', async (req, res) => {
    if (!logged) {
        res.redirect('/auth')
        return;
    } else {
        var db_name = req.params.name;
        selected_db = db_name;
        let check = req.query.checks;
        await db_connect(db_name).then((data) => {
            var str = 'Tables_in_' + db_name
            var all_tables = [];
            var url = [];
            data.forEach(element => {
                all_tables.push(element[str]);
                var str1 = '/' + db_name + '/table/' + element;
                url.push(str1)
            });
            urls = url;
            if (check)
                res.send(data)
            else
                res.render('home.hbs', { title: 'hbs', db_name: db_name, all_tables: all_tables })
            return;
        }).catch((err) => {
            res.send(err)
            return;
        })
    }
})

server.get("/logout", async (req, res) => {
    await logout()
    logged = false;
    res.redirect('/auth')
})

server.get('/table/:table_name/', async (req, res) => {
    if (!logged) {
        res.redirect('/auth')
        return;
    } else {
        table = req.params.table_name;
        await get1(table).then(() => {
            res.render('show.hbs', { title: table, emt: emt, scema: scem, db: selected_db })
        }).catch((err) => {
            let url = '/' + selected_db + '/db/'
            res.redirect(url)
        })
    }
})

async function get1(table_name) {
    return new Promise(async function (resolve, reject) {
        let table = table_name;
        empt = '';
        let resolved = false;
        await gettable()
            .then(async function (data) {
                let search = 'Tables_in_' + selected_db;
                await data.forEach(async function (element) {
                    if (element[search] == table) {
                        resolved = true;
                        try {
                            select(table).then(async function (data1) {
                                if (data1.length == 0) emt = 'table is empty';
                                else emt = '';
                            }).catch((err) => {
                                console.log(err);
                            })
                            await scema(table).then(async function (d) {
                                scem = d;
                                resolve()
                                return;
                            }).catch((er) => {
                                console.log(er);
                            })
                        } catch (error) {

                        }
                    }
                });
                if (!resolved)
                    reject()
            })
            .catch((err) => {
                reject()
                return;
            })

    })
}

server.get('/table_/data_', async (req, res) => {
    let table = req.query.table;
    await select(table).then((data1) => {
        res.send(data1)
    })
})

server.get('/table_/scema_', (req, res) => {
    var table = req.query.table;
    scema(table).then((data) => {
        scem = data;
        res.send(data)
    }).catch((err) => {
        res.send(500, err);
    })
})

server.get('/insert', (req, res) => {
    var table = req.query.table;
    var arr = [];
    scema(table).then((data) => {
        data.forEach(d => {
            var fill = d.Field;
            var ev = 'req.query.';
            ev += fill;
            arr.push(eval(ev));
        })
        insert(table, arr).then((data) => {
            var url = '/table/' + table;
            res.redirect(url);
        }).catch((e) => {
        })
    }); 
})

server.get('/changeColumnName', (req, res) => {
    var table = req.query.table;
    var old_name = req.query.prev_name;
    var new_name = req.query.new_name;
    changeColumnName(table, old_name, new_name).then((d) => {
        res.send(d);
    }).catch((d) => {
        res.send(d)
    })

})

server.get('/getalltable', (req, res) => {
    gettable().then((d) => {
        res.send(d)
    })
})

server.get('/changeName', (req, res) => {
    var table_name = req.query.prev_name;
    var new_table_name = req.query.new_name;

    changeName(table_name, new_table_name).then((d) => {
        res.send(d);
    })
        .catch((e) => {
            res.send('error')
        })
})

server.get('/data', (req, res) => {
    let table = req.query.table;

    select(table).then((data1) => {
        var tableEntry = [];
        tableEntry.push(data1);
        tableEntry.push(scem);
        res.send(tableEntry)
    })
})

server.get('/data_search', async (req, res) => {
    let table = req.query.table;
    let search_by = req.query.search_by;
    let search = req.query.search;

    search_data(table, search_by, search).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send('Not Found')
    })

})

server.get('/table/delete/:table', (req, res) => {
    var table = req.params.table;
    let url = '/' + selected_db + '/db/'
    deletetable(table).then((d) => {
        setTimeout(function () {
            res.redirect(url)
        }, 5000);
    }).catch((e) => {
        res.redirect(url);
    })
})

server.get('/delete/:table', (req, res) => {
    var table = req.params.table;

    dropalldata(table).then((d) => {
        var url = '/table/' + table;
        res.redirect(url);
    }).catch((e) => {
        res.redirect('/');
    })
})


server.post('/auth#/', async (req, res) => {
    var pass = req.body.password;
    if (pass == 'mypass') {
        res.send('logged')
    } else {
        res.send('wrong')
    }
})

server.post('/auth', async (req, res) => {
    if (!logged) {
        var pass = req.body.password;
        console.log("pass : ",pass);
        if (pass == 'undefined') {
            logged = false;
            res.redirect('/auth')
        }
        auth(pass)
            .then((data) => {
                logged = true;
                console.log(data);
                res.send('logged')
                return;
            }).catch((err) => {
                logged = false;
                console.log(err);
                res.send('wrong')
                return;
            })
    } else {
        res.send('logged')
    }
})

server.post('/form_url', (req, res) => res.send(urls));

server.post('/addMulData', async (req, res) => {
    let table = req.body.table;
    let insert_data = req.body.data;
    let n = req.body.size;
    let scem;
    let sendmess = "true"
    await scema(table).then((data) => {
        scem = data;
    })
    for (let i = 0; i < n; i++) {
        var arr = [];
        await scem.forEach(d => {
            var fill = d.Field;
            var ev = insert_data[i];
            arr.push(ev[fill]);
        })
        await insert(table, arr).then((data) => {

        }).catch((e) => {
            sendmess = 'error';
        })
    }
    res.send(sendmess);
})

server.post('/%entry_delete%/', async function (req, res) {
    let table_name = req.body.table_name;
    let isprimaryKey = req.body.isprimaryKey;
    let primarykey = req.body.primarykey.toString();
    let entry_obj = req.body.entry_obj;
    let scema = req.body.scema;

    if (isprimaryKey == 'true') {
        let condition = primarykey + '=' + "'" + entry_obj['primarykey'] + "'"
        delete_entry(table_name, condition).then((mess) => {
            res.send(mess);
        }).catch((err) => {
            res.send(err)
        })
    } else if (isprimaryKey == 'false') {
        let condition = "";
        let n = scema.length,
            i = 0;
        await scema.forEach(element => {
            condition += element.Field + '=' + "'" + entry_obj[element.Field] + "'"
            if (i != n - 1)
                condition += ' AND '
            i++;
        });
        delete_entry(table_name, condition).then((mess) => {
            res.send(mess);
        }).catch((err) => {
            res.send('error on deltion')
        })
    }
})

server.post('/%entry_update%/', async function (req, res) {
    let table_name = req.body.table_name;
    let isprimaryKey = req.body.isprimaryKey;
    let primarykey = req.body.primarykey.toString();
    let update_entry = req.body.update_entry;
    let entry_obj = req.body.entry_obj;

    let scema = req.body.scema;

    let update_string = ""

    scema.forEach((element, index) => {
        update_string += element.Field + '=' + "'" + update_entry[index] + "'";
        if (index != scema.length - 1)
            update_string += ',';
    });

    if (isprimaryKey == 'true') {
        let condition = primarykey + '=' + "'" + entry_obj['primarykey'] + "'"

        update_data(table_name, update_string, condition).then((mess) => {
            res.send(mess);
        }).catch((err) => {
            res.send(err)
        })
    } else if (isprimaryKey == 'false') {
        let condition = "";
        let n = scema.length,
            i = 0;
        await scema.forEach(element => {
            condition += element.Field + '=' + "'" + entry_obj[element.Field] + "'"
            if (i != n - 1)
                condition += ' AND '
            i++;
        });
        update_data(table_name, update_string, condition).then((mess) => {
            res.send(mess);
        }).catch((err) => {
            res.send('error on deltion')
        })
    }

})

server.post('/create/:name', async (req, res) => {
    let db_name = req.params.name;
    var total_colums = req.body.total;
    var table_name = req.body.table_name;
    table_name = table_name.trim().toUpperCase();
    table_name = table_name.replace(/[&\/\\#,+()$~%.'": *?<>{}]+/g, "_");

    var sql_String = "";
    var pm = false;
    var sno_found = false;
    for (let i = 1; i <= total_colums; i++) {
        var input = "ipt" + i;
        input = input.toString();
        var reqs = 'req.body.' + input

        var primary = false;
        if (req.body.radio == i) {
            primary = true;
            pm = true;
        }
        var sq = eval(reqs)
        sq = sq.trim().toUpperCase().replace(/[&\/\\#,+()$~%.'": *?<>{}]+/g, '-', "_");
        if (sq == 'SNO') {
            sno_found = true
        }
        sql_String += sq;
        sql_String += " ";
        input = "TYPE" + i;
        reqs = 'req.body.' + input

        if (eval(reqs) == "Number") {
            sql_String += "Integer";
            if (primary)
                sql_String += " Primary Key "
            if (i != total_colums)
                sql_String += ",";
        }
        if (eval(reqs) == "Charcters") {
            sql_String += "varchar(60)";
            if (primary)
                sql_String += " Primary Key "
            if (i != total_colums)
                sql_String += ",";
        }
        if (eval(reqs) == "date") {
            sql_String += "timestamp";
            if (primary)
                sql_String += " Primary Key "
            if (i != total_colums)
                sql_String += ",";
        }
    }
    await create(table_name, sql_String, pm, sno_found).then((d) => {
        let url = '/' + db_name + '/db';
        res.redirect(url);

    }).catch((e) => {
        res.send('error occurs' + e);
    })
})

server.listen(port, () => {
    console.log('hi! mysql server is running at localhost:', port);
    open(`http://localhost:${port}`);
})

