let express = require("express")
let router = express.Router();
const { get_DataBases, auth, delete_entry, search_data, connection, update_data, db_connect, create, gettable, select, scema, changeColumnName, insert, deletetable, dropalldata, changeName, logout } = require('../db_helpers')

var logged=false;

router.post("/",  (req, res) =>{  
    res.send("dfsf");
})

router.post('/auth', async (req, res) => {
    if (!logged) {
        var pass = req.body.password;
        if (pass == 'undefined') {
            logged = false;
            res.redirect('/auth')
        }
        auth(pass)
            .then((data) => {
                logged = true;
                res.send('logged')
                return;
            }).catch((err) => {
                logged = false;
                res.send('wrong')
                return;
            })
    } else {
        res.send('logged')
    }
})

router.post('/form_url', (req, res) => res.send(urls));

router.post('/addMulData', async (req, res) => {
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

router.post('/%entry_delete%/', async function (req, res) {
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

router.post('/%entry_update%/', async function (req, res) {
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

router.post('/auth#/', async (req, res) => {
    var pass = req.body.password;
    if (pass == 'mypass') {
        res.send('logged')
    } else {
        res.send('wrong')
    }
})

router.post('/create/:name', async (req, res) => {
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

module.exports=router;