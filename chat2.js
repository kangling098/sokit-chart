// 1.如果想说话时赋予一些特殊意义 你可以自己增加一些表示
// l:看所有的在线人数
// s:sz:i love you 私聊
// r:ls 改名
// b:广播和所有人说话
// client = {127.0.0.1:8080:{nickName:'匿名',socket:socket}}
let  net = require('net');
let client = {};
let server = net.createServer(socket=>{
  server.maxConnections = 4;
  server.getConnections((err,count)=>{
    socket.write(`欢迎到来,当前人数为${count},总容纳数${server.maxConnections}\r\n`);
  })
  let key = socket.remoteAddress + socket.remotePort;
  socket.setEncoding('utf8');
  client[key] = {nickName:'匿名',socket};
  socket.on('data',chunk=>{
    chunk = chunk.replace(/\r\n/,'');
    let char = chunk.split(':')[0];
    let content = chunk.split(':')[1];
    switch(char){
      case 'l':
        showList(socket); //显示用户列表
        break;
      case 's':
        private(chunk.split(':')[1],`${client[key].nickName}:${chunk.split(':')[2]}`);
        break;
      case "r":
        rename(key,content);
        break;
      case 'b':
        broadcast(key,content);
        break;
    }
  })
})
function broadcast(key,content){
  Object.keys(client).forEach(index=>{
    if(key !==index) client[index].socket.write(`${client[key].nickName}:${content}`)
  })
}
function rename(key,content){
  client[key].nickName = content;
}
function private(targetNickName,message){
  Object.keys(client).forEach(key=>{
    if(client[key].nickName === targetNickName) client[key].socket.write(`${message}\r\n`)
  })
}
function showList(socket){
  let users = [];
  Object.keys(client).forEach(key=>{
    users.push(client[key].nickName);
  })
  socket.write(`当前用户列表:\r\n${users.join('\r\n')}\r\n`)
}
let port = 3000;
server.listen(3000,_=>{
  console.log(`server start ${port}`)
})