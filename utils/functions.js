/*
* Common Javascript Function Units
* @author WangBin
* @Time 2017.12.13
* */
var fs = require("fs");

/*
* 读取Json文件
* @param jsonPath json文件路径
* @param async 同、异步标识，true为同步，默认为false
* */
function readJsonFile(jsonPath,async)
{
    if(async==undefined){async=false;}

    if(!async)
    {
        fs.readFile(filePath, function (err, data){
            if(err){return;}//throw err;
            return JSON.parse(data);
        });
    }
    else
    {
        return JSON.parse(fs.readFileSync(jsonPath));
    }
}

exports.readJsonFile = readJsonFile;