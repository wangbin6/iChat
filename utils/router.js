/*
 * 路由
 * */
var fs = require('fs');

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
        var iface_arr = [{icon:"/public/images/ifaces/angrya_thumb.gif",title:"[怒]"},
            {icon:"/public/images/ifaces/bs2_thumb.gif",title:"[鄙视你]"},
            {icon:"/public/images/ifaces/bz_thumb.gif",title:"[闭嘴]"},
            {icon:"/public/images/ifaces/cj_thumb.gif",title:"[吃惊]"},
            {icon:"/public/images/ifaces/cry.gif",title:"[衰]"},
            {icon:"/public/images/ifaces/hatea_thumb.gif",title:"[哼]"},
            {icon:"/public/images/ifaces/heia_thumb.gif",title:"[偷笑]"},
            {icon:"/public/images/ifaces/k_thumb.gif",title:"[打哈欠]"},
            {icon:"/public/images/ifaces/kbsa_thumb.gif",title:"[扣鼻屎]"},
            {icon:"/public/images/ifaces/kl_thumb.gif",title:"[可怜]"},
            {icon:"/public/images/ifaces/laugh.gif",title:"[大笑]"},
            {icon:"/public/images/ifaces/ldln_thumb.gif",title:"[懒得理你]"},
            {icon:"/public/images/ifaces/lovea_thumb.gif",title:"[爱你]"},
            {icon:"/public/images/ifaces/mb_thumb.gif",title:"[太开心]"},
            {icon:"/public/images/ifaces/no_thumb.gif",title:"[不要]"},
            {icon:"/public/images/ifaces/sada_thumb.gif",title:"[泪]"},
            {icon:"/public/images/ifaces/sb_thumb.gif",title:"[生病]"},
            {icon:"/public/images/ifaces/shamea_thumb.gif",title:"[害羞]"},
            {icon:"/public/images/ifaces/shenshou_thumb.gif",title:"[神马]"},
            {icon:"/public/images/ifaces/sleepa_thumb.gif",title:"[睡觉]"},
            {icon:"/public/images/ifaces/smilea_thumb.gif",title:"[呵呵]"},
            {icon:"/public/images/ifaces/t_thumb.gif",title:"[吐]"},
            {icon:"/public/images/ifaces/tza_thumb.gif",title:"[可爱]"},
            {icon:"/public/images/ifaces/wq_thumb.gif",title:"[委屈]"},
            {icon:"/public/images/ifaces/x_thumb.gif",title:"[嘘]"},
            {icon:"/public/images/ifaces/z2_thumb.gif",title:"[大赞]"},
            {icon:"/public/images/ifaces/zy_thumb.gif",title:"[挤眼]"}];

        res.writeHead(200,{'Content-type':'text/plain;charset=UTF-8'});
        res.end(JSON.stringify(iface_arr));
    }
}

exports.route = route;
