/*服务器启动程序*/
var http = require('http');
var url = require('url');

var httpPort = 3000;//服务器监听端口号

function start(route,socket)
{
    var server = http.createServer(function (req, res) {

        var pathname = url.parse(req.url).pathname;

        //路由处理
        route(res, pathname);

    }).listen(httpPort);

    console.log('http server 已启动！');

    //启动socket.io
    socket(server);
}

exports.start = start;