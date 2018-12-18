var fs = require('fs');
var path = require("path");
var querystring = require('querystring');

var files = {};
// 读取文件
files.readFile = (req, res, file, call) => {
	fs.readFile(path.join(__dirname, `./${file}.json`), 'utf-8', function(err, res) {  
      if (err) {  
        console.log(err)  
      } 
      let data = querystring.parse(res)
      call(data)
  });
};
// 写入文件
files.writtenFile = (file, value) => {
	let date = new Date().getTime();
  let data = {
    date: date
  }
  if (file == 'jsapi_ticket') {
    data.jsapi_ticket = value;
  } else {
    data.access_token = value;
  }
	let string = querystring.stringify(data)
	fs.writeFile(path.join(__dirname, `./${file}.json`), string, function(err) {  
    if (err) {  
      console.log(err)  
    }
  });
}

module.exports = files;