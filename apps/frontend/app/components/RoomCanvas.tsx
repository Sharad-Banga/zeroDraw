"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";

function RoomCanvas(roomId: { roomId: string }) {
  const [socket , setSocket] = useState<WebSocket | null>(null); 
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoYXJhYWRpaXRAZ21haWwuY29tIiwidXNlcklkIjoiZDNjMzdjOTMtYjQ4Ni00Y2JjLWFkMDAtZjY4ODJjYTUzOTYzIiwiaWF0IjoxNzcyNjc2MTM4LCJleHAiOjE3NzI2OTQxMzh9.luehLeUuD0EUInaBKctqshXdibvXPfJ_ZSdz7roYmCM" ;
  
  useEffect(()=>{ 
    const ws = new WebSocket(`ws://localhost:3002?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId: roomId.roomId })); 
    }; 
  },[])

  if(!socket){
    return <div>Loading...</div>
  }
  
  return (
    <div className="w-screen h-screen">
      <Canvas roomId={roomId.roomId} socket={socket} />
    </div>
  )
}

export default RoomCanvas