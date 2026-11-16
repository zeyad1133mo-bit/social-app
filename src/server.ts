import { createApp } from "./app";
import http from "node:http";
import mongoose from "mongoose";
import "./lib/db/connnection";

const app = createApp();
const server = http.createServer(app);



server.listen(3000,()=>{
    console.log("Server is running on port 3000");
})



async function shutdown(){

  await mongoose.disconnect();
  server.close();
  process.exit(0);

}


process.on("SIGINT",shutdown);
process.on("SIGTERM",shutdown);