/*
 * 首页javascript代码
 * 2017.10.31.WangBin
 * */

//cookie保存昵称的key
var cookie_nk_key = "nickname";
//当前用户的昵称
var currNickname = "";
//socket句柄
var socket = null;
//cookie不存在昵称
var nickFlag = true;
//从服务器获取的表情信息
var fasesjsonObj = null;
//表情title存储，用于匹配表情title，转换成表情图片显示在聊天框
var facesTitlesArr = [];

/*
 *获取页面操作对象
*/
//发送按钮
var sendBtn = document.getElementById("sendBtn");
//清空按钮
var clearBtn = document.getElementById("clearBtn");
//输入区域
var inputArea = document.getElementById("inputText");
//消息显示区域
var messages = document.getElementById("messages");
//聊天窗口
var iChat = document.getElementById("iChat");
//创建昵称区域
var Nick = document.getElementById("Nick");
//创建昵称input表单控件
var myPromptInputVal = document.getElementById("myPromptInputVal");
//创建昵称button控件
var createNickBtn = document.getElementById("createNickBtn");
//在线人数统计显示区域
var onlineCount = document.getElementById("onlineCount");
//在线人数
var onlineNum = document.getElementById("onlineNum");
//在线人列表显示区域
var onlineList = document.getElementById("onlineList");
//系统通告栏
var tools = document.getElementById("tools");
//表情图标
var moji = document.getElementById("moji");
//表情列表table
var ifacestable = document.getElementById("mojisAreaTable");
//表情列表区域
var mojisArea = document.getElementById("mojisArea");

/*
 * 页面加载完检测昵称是否创建
 * 绑定回车键发送消息
 * */
if(window.attachEvent)
{
    window.attachEvent('onload',function () {
        init_app();
    });
}
else
{
    window.addEventListener('load',init_app,false);
    window.addEventListener('beforeunload',onunloadHandler,false);
}

//按钮注册点击事件
sendBtn.addEventListener("click", sendBtnClick,false);
clearBtn.addEventListener("click", clearBtnClick,false);
createNickBtn.addEventListener("click", setCookieNickName, false);
moji.addEventListener("click", showMojiArea,false);

//初始化socket句柄
function initConnect()
{
    var surl = window.location.hostname+":3000";
    socket=io.connect(surl);//与服务器进行连接

    if(socket!=null)
    {
        //通知服务器新用户加入群聊
        socketSendSys('conn');
    }
}

//初始化socket操作
function initSocketEvent()
{
    if(socket!=null)
    {
        //接收来自服务端的信息事件text
        socket.on('text',function(msg){
            if(msg!="")
            {
                //创建相应的div节点
                var div = document.createElement('div');
                var nickTimeDIv = document.createElement('div');
                var contentDiv = document.createElement('div');
                var nickTimeTextNode = document.createTextNode(msg.nickname +' '+ getDateStr());
                nickTimeDIv.style.fontSize = '10px';
                //追加消息时间和昵称的文字节点
                nickTimeDIv.appendChild(nickTimeTextNode);
                div.appendChild(nickTimeDIv);

                //匹配消息字符串中可能存在的表情符号
                //将有效的表情符号替换成表情图片，并删除该有效的字符
                var msgText = msg.content;
                var faceIcos = msgText.match(/\[\S+?\]/g);
                if(faceIcos!=null)
                {
                    for(var i=0;i<faceIcos.length;i++)
                    {
                        var title = faceIcos[i];

                        for(j in fasesjsonObj)
                        {
                            var facesjon = fasesjsonObj[j];

                            if(facesjon.title==title)
                            {
                                var index = msgText.indexOf(title);
                                var subText = msgText.substring(0,index);

                                //删除匹配的表情title并创建img表情节点替换
                                msgText = msgText.replace(title,"");

                                if(subText!="")
                                {
                                    var contentTextNode = document.createTextNode(subText);
                                    contentDiv.appendChild(contentTextNode);
                                    div.appendChild(contentDiv);
                                    msgText = msgText.replace(subText,"");
                                }

                                var contentImgNode = document.createElement("img");
                                contentImgNode.setAttribute("src",facesjon.icon);
                                contentImgNode.setAttribute("title",facesjon.title);
                                //追加消息图片img节点
                                contentDiv.appendChild(contentImgNode);
                                div.appendChild(contentDiv);
                            }
                        }
                    }

                    if(msgText!="")
                    {
                        var contentTextNode = document.createTextNode(msgText);
                        contentDiv.appendChild(contentTextNode);
                        div.appendChild(contentDiv);
                    }
                }
                else
                {
                    var contentNode = document.createTextNode(msg.content);
                    contentDiv.appendChild(contentNode);
                    div.appendChild(contentDiv);
                }

                messages.appendChild(div);
            }

            scrollToBottom(messages);//消息显示区滚动条移至最下
        });

        //接收服务器端的系统公告
        socket.on('sys', function (msg) {
            if(msg.state == 'conn')
            {
                //通告新用户上线提醒
                var nickname = msg.content;
                var div = document.createElement("div");
                var connText = document.createTextNode("系统消息: 用户" + nickname + "加入群聊！");
                div.appendChild(connText);
                div.style.width = "100%";
                div.style.height = "20px";
                div.style.fontSize = "10px";
                div.style.textAlign = "center";
                div.style.backgroundColor = "red";
                messages.appendChild(div);
            }
            else if(msg.state == 'onlineNum')
            {
                //通告在线人数
                var Num = msg.content;
                onlineNum.innerText = Num;

                //在线列表
                var list = msg.users;
                var arrList = list.split(',');

                onlineList.innerHTML = "";//清空在线用户列表
                for(i in arrList)
                {
                    if(arrList[i]!="")
                    {
                        var div = document.createElement('div');
                        div.style.borderBottom = "1px solid black";
                        div.style.textAlign = "center";
                        var text = document.createTextNode(arrList[i]);
                        div.appendChild(text);
                        onlineList.appendChild(div);
                    }

                }
            }

            scrollToBottom(messages);//消息显示区滚动条移至最下
        });
    }
    else
    {
        console.log("socket未成功连接服务器端...");
    }
}

//socket发送文本消息
function socketSendText(text)
{
    socket.emit('text', {"content":text,"nickname":currNickname});
}

//socket发送系统消息至服务器
function socketSendSys(state)
{
    socket.emit('sys',{'state':state,'nickname':currNickname,'flagNick':nickFlag});
}

//发送消息
function sendBtnClick() {
    var text = inputArea.value;

    if(text == "")
    {
        //设置输入框placeholder属性
        inputArea.setAttribute('placeholder',"发送内容不能为空...");
    }
    else
    {
        //发送消息
        socketSendText(text);

        //清空输入框消息内容
        clearBtnClick();
    }
}

//清空消息
function clearBtnClick() {
    inputArea.value = "";
}

//初始化聊天昵称,没有则返回false，有则返回true
function initNickName() {
    var nk = getcookieNickName();

    if(nk == "")
    {
        Nick.style.display = 'block';

        return false;
    }
    else
    {
        Nick.style.display = 'none';

        return true;
    }
}

//设置cookie保存聊天昵称
function setCookieNickName() {
    var nk=myPromptInputVal.value;

    if(nk!=null && nk!="")
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+365)
        document.cookie=cookie_nk_key+ "=" +decodeURI(nk)+"; expires="+exdate.toGMTString();

        currNickname = nk;
        //隐藏创建昵称区域
        Nick.style.display = 'none';

        nickFlag = false;//cookie存在昵称

        init_app();
    }
    else
    {
        Nick.style.display = 'block';
    }
}

//读取cookie设置的昵称,为空则提示设置昵称
function getcookieNickName() {
    if(document.cookie.length > 0)
    {
        var c_start = document.cookie.indexOf("nickname=");
        if(c_start>-1)
        {
            c_start = c_start + cookie_nk_key.length + 1;
            c_end = document.cookie.indexOf(";", c_start);

            if(c_end == -1) c_end = document.cookie.length;

            var nk = decodeURI(document.cookie.substring(c_start,c_end));

            currNickname = nk;

            return decodeURI(document.cookie.substring(c_start,c_end));
        }
    }

    return "";
}

//初始化回车键发送消息事件
function initEnterKey() {
    document.onkeydown = function (event) {
        event = event?event:window.event;//注意这一句，event需要兼容设置
        if(event.keyCode == 13)
        {
            sendBtnClick();
            clearBtnClick();

            return false;
        }
    };
}

//初始化app
function init_app()
{
    if(initNickName())
    {
        if(socket==null)
        {
            //初始化socket句柄
            initConnect();
            //初始化socket操作事件
            initSocketEvent();
        }

        initEnterKey();
    }

    //初始化表情图标
    init_ifaces();
}

//初始化表情图标
function init_ifaces()
{
    var url = "http://"+window.location.hostname+":3000/controller/getIfaces";
    ajax('GET',url,'',true,function (data) {
        fasesjsonObj = JSON.parse(data);

        var line = 1;//表情列表的行数
        var lineNum = 21;//每行表情显示的个数

        for(i in fasesjsonObj)
        {
            var o = fasesjsonObj[i];

            if(line%lineNum==0){line=0;}

            if(line==1)
            {
                var tr = document.createElement("tr");
                ifacestable.appendChild(tr);
            }

            var td = document.createElement("td");
            var img = document.createElement("img");
            img.setAttribute("src",o.icon);
            img.setAttribute("title",o.title);
            img.setAttribute("class",'face');
            td.appendChild(img);
            tr.appendChild(td);

            //将表情的title存入数组
            facesTitlesArr.push(o.title);

            line++;
        }

        //初始化表情选中事件，选中后将表情的title输出到textarea中
        initFacesClick();
    });

    mojisArea.addEventListener("click",mojisAreaCLick,false);
}

//初始化聊天表情点击事件
function initFacesClick()
{
    var faces = document.getElementsByClassName("face");
    for(i=0;i<faces.length;i++)
    {
        (function(i){
            faces[i].addEventListener("click",function () {
                var title = this.getAttribute("title");
                inputText.value += title;
            });
        })(i);
    }
}

//表情区域的隐藏与显示
function mojisAreaCLick()
{
    mojisArea.style.display = 'block';
}

//关闭页面处理函数
function onunloadHandler() {
    alert('page close');
}

//显示表情选题框
function showMojiArea() {
    if(mojisArea.style.display=='block')
    {
        mojisArea.style.display = 'none';
        moji.setAttribute("src","/public/images/moji.png");
    }
    else
    {
        mojisArea.style.display = 'block';
        moji.setAttribute("src","/public/images/moji_active.png");
    }

}

//初始化聊天控件图标变换
function initChartPlusPngChange()
{

}

Notification.requestPermission( function(status) {
    console.log(status); // 仅当值为 "granted" 时显示通知
    var n = new Notification("新消息！", {body: "您有新消息罗！"}); // 显示通知
});