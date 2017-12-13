/*处理socketio事件*/

//在线的用户
var users = [];

//在线的用户总数
var usersCount = 0;

function init_socketio(server)
{
    //初始化socket.io
    var io = require('socket.io')(server);

    console.log('socket.io 已启动！');

    //监听接收到的消息
    io.on("connection", function (socket) {
        var _users = arrUsersCount();//去除无效数组元素的users数组
        var onlineListStr = getOnlineUser(_users);
        io.emit('sys',{'state':'onlineNum','content':_users.length,"users":onlineListStr});

        //监听用户进入群聊
        socket.on('sys', function (data) {
            var state = data.state;
            if(state == 'conn')
            {
                //查询用户不存在users数组内
                if(!userExist(data.nickname))
                {
                    usersCount ++;
                    socket.userIndex = usersCount;
                    socket.nickname = data.nickname;
                    var info = [];
                    info['nickname'] = data.nickname;
                    users[usersCount] = info;

                    if(!data.flagNick)
                    {
                        io.emit('sys',{'state':'conn','content':data.nickname});
                    }
                }
                var _users = arrUsersCount();//去除无效数组元素的users数组
                var onlineListStr = getOnlineUser(_users);
                io.emit('sys',{'state':'onlineNum','content':_users.length,"users":onlineListStr});
            }
        });

        //监听消息
        socket.on("text", function (data) {
            io.emit('text',data);
        });

        //监听用户退出聊天室
        socket.on('disconnect', function () {
            users[socket.userIndex] = undefined;

            var _users = arrUsersCount();//去除无效数组元素的users数组
            var onlineListStr = getOnlineUser(_users);
            io.emit('sys',{'state':'onlineNum','content':_users.length,'users':onlineListStr});
        });

    });
}


//判断用户是否已存在users数组,存在返回true,不存在返回false
function userExist(username)
{
    for(var i=0;i<=usersCount;i++)
    {
        if(users[i]!=undefined && username == users[i].nickname)
        {
            return true;
        }
    }

    return false;
}

//统计users数组，去除undefined
function arrUsersCount() {
    var n = [];
    for(i in users)
    {
        if(users[i]!=undefined)
        {
            n.push(users[i]);
        }
    }

    return n;
}

//获取在线的用户名，返回字符串用逗号隔开
function getOnlineUser(_user) {
    var s = "";
    for(i in _user)
    {
        if(_user[i]!=undefined && _user[i]['nickname']!="")
        {
            s += _user[i]['nickname'] + ",";
        }
    }

    return s;
}

exports.init_socketio = init_socketio;
