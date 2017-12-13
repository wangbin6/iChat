/*
* mysql操作函数
* @author WangBin
* @time 2017.12.07
* */
var mysql = require("mysql");

var connection = null;
//连接数据库
function connectMysql()
{
    connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'ltech',
        database:'ltivalley20'
    });

    connection.connect();

    console.log("mysql 数据库已连接！");
}

//查询
function query(sql)
{
    connection.query(sql, function (err,res) {
        if(err)
        {
         console.log('[ERROR] SELECT: '+err.message);
         return;
        }

        console.log(res.length);
    });
}

exports.connectMysql = connectMysql;
exports.query = query;