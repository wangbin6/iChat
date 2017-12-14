/*
* mysql操作函数
* @author WangBin
* @time 2017.12.07
* */
var mysqld = require("mysql");
var functions = require("./functions");

var connection = null;
//连接数据库
function connectMysql()
{
    //读取数据库配置文件
    var databaseJson = functions.readJsonFile("./config/database.json",true);

    connection = mysqld.createConnection({
        host:databaseJson.host,
        user:databaseJson.user,
        password:databaseJson.root,
        database:databaseJson.database
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