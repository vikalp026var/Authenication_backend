const mongoose=require('mongoose');
require('dotenv').config();
const MONGODB_URL=process.env.MONGODB_URL||"mongodb://localhost:27017/my_database";
const databaseconnect=()=>{
     mongoose
     .connect(MONGODB_URL)
     .then((conn)=>console.log(`Connected to DB:${conn.connection.host}`))
     .catch((err)=>console.log(console.log(err.message)));
     
}
module.exports=databaseconnect;