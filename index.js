const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server,{cors:{origin:'*'}});
require('dotenv').config();
const PORT=process.env.PORT;

io.on("connection",(socket)=>{
      socket.on('join',(meetId)=>{
       let size=io.sockets.adapter.rooms.get(meetId)?.size;
       if(!size){
        console.log('now meeting size is 1');
         socket.join(meetId);
         console.log(meetId)
       }else if(size==1){
        console.log('now meeting size is 2');
        console.log('meet id '+meetId);
        socket.join(meetId);
        socket.emit('initiate');
      }else{
        console.log('full');
       socket.emit("full","Meeting at full capacity so cannot connect !");
      }
      socket.on('disconnect',()=>{
        console.log('discconected');
        socket.to(meetId).emit("disconnected");
      })
      });
      socket.on('call',(meetId,signal,name,image)=>{
         socket.to(meetId).emit('receiver',signal,name,image);
      });
      socket.on('accept',(meetId,signal,name,image)=>{
         socket.to(meetId).emit('response',signal,name,image);
      });
});
server.listen(PORT,()=>console.log(`server started listening on port ${PORT}`));
