import path from "path" ;
import express from 'express';
import dotenv from "dotenv" ;
import connectDB from "./db/connectDB.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { v2 as cloudinary} from "cloudinary" ;
import {app,server} from './socket/socket.js'

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000 ;
const _dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
 });

app.use(express.json({limit:"50mb"})) ;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/users" , userRoutes);
app.use("/api/posts" , postRoutes);
app.use("/api/messages" , messageRoutes);

// app.get("/" , async (req , res) => {
//   res.send("Hello World");
//  });


 if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname, "/chatAppfrontend/dist")));

  app.get("*" , (req, res) => {
    res.sendFile(path.resolve(_dirname, "chatAppfrontend", "dist", "index.html"));
  });
  
 }

server.listen(PORT , () => {
  console.log(`Listening to port ${PORT}`);
})
    