import { WebSocketServer,WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"; 
const wss = new WebSocketServer({ port: 3002 });
import { db, chats } from "@repo/db";


interface User{
  ws:WebSocket,
  rooms : string[],
  userId : string
}

const users : User[] = [];

function checkUser(token : string):null{
  
  const decoded = jwt.verify(token , JWT_SECRET);

  if(typeof(decoded)=== "string"){
    return null;
  }

   if(!decoded || !(decoded as JwtPayload).userId){
      return null;
    }

  return decoded.userId;
}

wss.on("connection", (ws,Request ) => {
  console.log("Client connected");    
  const url = Request.url;
  if(!url){
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(url?.split('?')[1]);
  const token = queryParams.get('token') || "";
  
  const userId = checkUser(token);

  if(userId == null){
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms:[],
    ws
  });

 

  ws.on("message",async function(data){
    
    const parsedData = JSON.parse(data.toString());

    if(parsedData.type === "join_room"){
        const user = users.find(u=>u.ws === ws);
        user?.rooms.push(parsedData.roomId);
        // console.log("user",user);
        
    }
    
    if(parsedData.type === "leave_room"){
      const user = users.find(x=>x.ws===ws);
      if(!user){
        return;
      }
      user.rooms = user?.rooms.filter(x=>x!==parsedData.room)
    }
    // console.log(users);
    
    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      console.log("gggg");


      await db.insert(chats).values({
        roomId,
        message,
        userId
      }).returning();
      
      users.forEach(user=>{
        console.log("sendd");
        
        if(user.rooms.includes(roomId)){ user.ws.send(JSON.stringify({ type : "chat", message : message, roomId })) }
      })
    }


  })
  
});
