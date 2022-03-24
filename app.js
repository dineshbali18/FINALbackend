require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')

const sectionRoutes=require('./routes/section')
const teachersRoutes=require('./routes/teachers')

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((e)=>{
      console.log(e);
      console.log("DB NOT CONNECTED SUCCESFULLY");
  });


const app=express();

app.use(bodyParser.json())
app.use(cors())


app.use("/api",sectionRoutes);
// app.use("/api",teachersRoutes);


app.listen(process.env.PORT,()=>{
    console.log("App is running..........")
})