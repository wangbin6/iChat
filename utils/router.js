/*
 * 路由
 * */
var fs = require('fs');
var functions = require("./functions");

function route(res, pathname)
{
    if(pathname == "/")
    {
        //主页HTML文件
        handleHtmlFile(res,'/views/index.html');
    }
    else if(pathname.indexOf("styles")>-1)
    {
        //处理CSS样式文件
        handleCssFile(res,pathname);
    }
    else if(pathname.indexOf("js")>-1)
    {
        //处理js脚本文件
        handleJsFile(res,pathname);
    }
    else if(pathname.indexOf("images")>-1)
    {
        //处理图片文件
        handleImageFile(res,pathname);
    }
    else if(pathname.indexOf("controller")>-1)
    {
        handleController(res,pathname);
    }
    else
    {
        res.writeHead(200,{'Content-type':'text/html;charset=UTF-8'});
        res.end('Page Not Found!');
    }

    console.log(pathname);
}

//返回CSS文件给浏览器
function handleCssFile(res,pathname)
{
    res.writeHead(200,{'Content-type':'text/css;charset=UTF-8'});
    iReadFileToBrower(res,pathname);
}

//返回JS脚本文件给浏览器
function handleJsFile(res,pathname)
{
    res.writeHead(200, {'Content-Type':'application/x-javascript;charset=UTF-8'});
    iReadFileToBrower(res,pathname);
}

//返回HTML文件给浏览器
function handleHtmlFile(res,pathname)
{
    res.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
    iReadFileToBrower(res,pathname);
}

//返回图片文件给浏览器
function handleImageFile(res,pathname) {
    res.writeHead(200, {'Content-Type':'image/*;charset=UTF-8'});
    iReadFileToBrower(res,pathname);
}

//读取文件，并返回给浏览器函数
function iReadFileToBrower(res,filePath)
{
    fs.readFile('.'+filePath, function (err, data){
        if(err){return;}//throw err;
        res.end(data);
    });
}

//处理前端页面的请求
function handleController(res,pathname)
{
    if(pathname.indexOf("getIfaces")>-1)
    {
        var iface_arr = functions.readJsonFile("./config/ichatfaces.json",true);

        res.writeHead(200,{'Content-type':'text/plain;charset=UTF-8'});
        res.end(JSON.stringify(iface_arr));
    }
}

exports.route = route;
