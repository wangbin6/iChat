/*
* iChart公共函数库文件
* 2017-12-05 13:04
* WangBin
* */

/*
* ajax请求
* @prams type 请求类型:POST/GET
* @prams data 请求数据，如果type为POST则data为空
* @prams url 请求地址
* @prams async 异步为true，同步为false
* @params callback 请求成功后的回调函数
* @return 请求成功后返回的数据
* */
function ajax(type,url,data,async,callback)
{
    if(type==undefined||type==''){type='GET';}
    if(async==undefined||async==''){async=true;}

    var xmlhttp = new XMLHttpRequest();//创建ajax对象
    xmlhttp.open(type,url,async);

    if(type.toUpperCase()=="POST")
    {
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    }
    else
    {
        data = "";
    }

    xmlhttp.send(data);//发送请求

    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200 && callback!=undefined)
        {
            callback(xmlhttp.responseText);
        }
    }
}

/*
* 判断数组中是否包含该元素
* @prams arr 被查询的数组
* @prams obj 待查询的元素
* @return true:存在 false:不存在
* */
function arrayContains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

//获取当前时间函数
function getDateStr()
{
    var mydate  = new Date();

    //var week_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
    var dateStr = '';
    var year    = mydate.getFullYear();
    var month   = mydate.getMonth()+1;
    var date    = mydate.getDate();
    var hours   = mydate.getHours();
    var minutes = mydate.getMinutes();
    var seconds = mydate.getSeconds();

    if(month   < 10){month   = '0'+month;}
    if(date    < 10){date    = '0'+date;}
    if(hours   < 10){hours   = '0'+hours;}
    if(minutes < 10){minutes = '0'+minutes;}
    if(seconds < 10){seconds = '0'+seconds;}

    dateStr += year+'-';
    dateStr += month+'-';
    dateStr += date+' ';
    dateStr += hours+':';
    dateStr += minutes+':';
    dateStr += seconds+' ';

    //dateStr += week_day[mydate.getDay()];

    return dateStr;
}

//将节点的滚动条移至最下面
function scrollToBottom(div)
{
    div.scrollTop = div.scrollHeight;
}