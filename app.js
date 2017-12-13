/*
 * iChat程序入口
 * 2017.10.30.WangBin
 * */
var server = require('./utils/server');
var router = require('./utils/router');
var socket = require('./utils/socketio');
var mysql = require('./utils/mysql');

//启动http服务器,socket.io服务器
server.start(router.route, socket.init_socketio);
//连接mysql数据库
mysql.connectMysql();