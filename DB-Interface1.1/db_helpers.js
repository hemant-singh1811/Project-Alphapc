const mysql = require('mysql2');
var connection = ""
var logged = false
const system_databases = ["information_schema", "sys", "performance_schema", "mysql"];
let connect = undefined;

async function auth(password) {
    return new Promise(async function (resolve, reject) { 
        connection = await mysql.createConnection({
            host:'localhost',
            user: 'root',
            password: password
        })
        connection.promise().query("SELECT 1").then((data) => {
            logged = true;
            resolve('success'); 
        }).catch((err) => {
            logged = false;
            connection = ""
            reject('error') 
        })
    })
}

function db_connect(db) {
    connect = connection;
    return new Promise(async function (resolve, reject) {
        connect.query(`use ${db} `, async function (err, result) {
            if (err)
                reject(err)
            else {
                await DataDb(connect).then((data) => {
                    resolve(data);
                });
            }
        })
    })
}

async function DataDb(connect) {
    return new Promise(function (resolve, reject) {
        connect.query(`show tables `, async function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })

}

async function get_DataBases() {
    if (connection != "" && logged) {
        return new Promise(async function (resolve, reject) {
            connection.query(`show databases `, async function (err, result) {
                if (err)
                    reject(err)
                else {
                    const res = []
                    await result.forEach((db) => {
                        if (system_databases.indexOf(db.Database) == -1) {
                            res.push(db.Database);
                        }
                    })
                    resolve(res)
                }
            })
        })
    }
}

function create(table_name, sql_String, primary, sno_found) { 
    var sql = "`" + `create table if not exists ${table_name}(`;
    if (!primary && !sno_found) {
        sql += `SNO Integer auto_increment primary key,`;
    }
    sql += sql_String + ')' + "`";
 
    return new Promise((resolve, reject) => {
        connect.query(eval(sql), function (err, result) {
            if (err) { 
                reject(err);
            } else {
                resolve('table ' + '"' + table_name + '"' + ' created successfully');
            }
        })
    })
}

function gettable() {
    return new Promise((resolve, reject) => {
        connect.query(`show tables`, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function scema(tables) {
    return new Promise(function (resolve, reject) {
        connect.query(`describe ${tables}`, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function select(table_name) {
    return new Promise(function (resolve, reject) {
        connect.query(`
             select * from ${table_name}
             `, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        })
    })
}

function deletetable(table_name) {
    return new Promise(function (resolve, reject) {
        connect.query(`
            drop table ${table_name};
            `, function (err, result) {
            if (err) {
                resolve();
            } else {
                reject();
            }
        })
    })
}

function changeColumnName(table, old_col, new_col) {
    return new Promise(function (resolve, reject) {
        connect.query(`
      ALTER TABLE ${table} RENAME COLUMN ${old_col} TO ${new_col};
      `, function (err, result) {
            if (err) { 
                reject('error')
            } else
                resolve('column name is change of table ', table);
        })
    })
}

function drop(table_name) {
    return new Promise((resolve, reject) => {
        connect.query(`drop table ${table_name}`, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function dropalldata(table_name) {
    return new Promise((resolve, reject) => {
        connect.query(`Delete from ${table_name}`, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function changeName(prev_name, new_name) {
    return new Promise(function (resolve, reject) {
        connect.query(`
                ALTER TABLE ${prev_name}   
                RENAME TO ${new_name};  
                `, function (err, result) {
            if (err) {
                reject(err)
            } else { 
                resolve('table name change succesfully to', new_name);
            }
        })

    })
}

function insert(table, data) { 
    var length = data.length;
    var str = '';

    for (let i = 0; i < length; i++) {
        str += "'";
        str += data[i];
        str += "'";
        if (i != length - 1)
            str += ",";
    } 

    return new Promise(function (resolve, reject) {
        connect.query(`
           insert into ${table} values(${str});
           `, function (err, result) {
            if (err)
                reject(err);
            else
                resolve('data is inserted successfully');
        })

    })

}

async function delete_entry(table, condition) {
    return new Promise(function (resolve, reject) {
        connect.query(`
             delete from ${table} where ${condition};
             `, function (err, result) {
            if (err)
                reject(err);
            else
                resolve('deleted');
        })
    })
}

async function update_data(table, update_string, condition) {
    return new Promise(function (resolve, reject) {
        connect.query(`
           update ${table} set ${update_string} 
           where ${condition};
        `, function (err, result) {
            if (err)
                reject(err);
            else
                resolve('deleted');
        })
    })
}

async function search_data(table, search_by, search) {
    let search_pattern = search + '%';
    return new Promise(function (resolve, reject) {
        connect.query(`
            SELECT * FROM ${table}
            WHERE ${search_by} LIKE '${search_pattern}'; 
            `, function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

async function logout() {
    await auth("$XXXXXX$").then((e) => { 

    }).catch((e) => { 

    })
}

module.exports = {
    get_DataBases,
    auth,
    connection,
    db_connect,
    delete_entry,
    mysql,
    update_data,
    create,
    search_data,
    changeColumnName,
    drop,
    gettable,
    scema,
    select,
    deletetable,
    changeName,
    dropalldata,
    insert,
    logout,
    connect
}