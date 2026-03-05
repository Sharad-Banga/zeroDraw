import express from "express";
const app = express(); 
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types";
import { chats, db, rooms, users } from "@repo/db";
import { middleware } from "./middleware";


app.use(express.json());

import cors from "cors";

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.post("/signup", async   (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
    if  (!parsedData.success){
        res.status(400).json({error: "Invalid data"});
        console.log("not parsed");
        
        return;
    }
    console.log("parsed");

    try{
      await db.insert(users).values({
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
        photo: "",
      });
      console.log("awaited");
      
      res.status(201).json({message: "User created"});
    }
    catch(e){
      console.log("DB ERROR:", e);
      
      res.status(500).json({error: "User creation failed"});
      return;
    }
});

app.post("/signin",async  (req, res) => {
   
  const parsedData = SignInSchema.safeParse(req.body);

  if(!parsedData.success){
    res.status(400).json({error: "Invalid data"});
    return;
  }

  const user = await db.query.users.findFirst(
    {
      where: (users, {eq }) => eq(users.email, parsedData.data.email)
    }
  );

  if(!user || user.password !== parsedData.data.password){
    res.status(401).json({error: "Invalid email or password"});
    return;
  }
  const token = jwt.sign({email: parsedData.data.email, userId: user.id}, JWT_SECRET, {expiresIn: "5h"});

  res.json({"token": token});
});

app.post("/room",middleware,async  (req, res) => {

  const parsedData = CreateRoomSchema.safeParse(req.body);
  if(!parsedData.success){
    res.json({
      message : "invaliod input"
    })
    return;
  }
  // @ts-ignore
  const userId = req.userId;

  try{
    const room = await db.insert(rooms).values({
        slug: parsedData.data.name,
        adminId: userId,
      }).returning();

      console.log("room",room);
      
      if(!room.length){
        return res.status(500).json({ message: "Failed to create room" });
      }

      res.json({
        room : room[0]!.id
      })
    res.status(201).json({message: "Room created"});

  }
  catch(e){
    console.log("DB ERROR:", e);
    res.json({
      message : "room pehle hi hai bhai"
    })
  }
});


app.get("/chats/:roomId",async (req,res)=>{
  const roomId = Number(req.params.roomId);

  const messages = await db.query.chats.findMany({
    where: (chat, { eq }) => eq(chat.roomId, roomId),
    orderBy: (chat, { desc }) => [desc(chat.id)],
    limit: 1000,
  });
  res.json({
    messages :messages
  })
})


app.get("/room/:slug",async (req,res)=>{
  const slug = req.params.slug;

  const room = await db.query.rooms.findFirst({
    where: (room, { eq }) => eq(room.slug, slug),
  });
  res.json({
    room :room
  })
})


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});