const { get_DataBases, auth, delete_entry, search_data, connection, update_data, db_connect, create, gettable, select, scema, changeColumnName, insert, deletetable, dropalldata, changeName, logout } = require('./db_helpers')
let express = require("express")
let router = express.Router();
const {connect} =require("./db_helpers");

console.log("connect : ",connect);

router.get("/",(req,res)=>{
    console.log("got the / request");
    console.log("connect : ",connect);

    const connect1 =require("./db_helpers").connect;

    console.log("connect : ",connect1);

    res.send("this is sample");
})



module.exports=router
