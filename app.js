const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')

const sectionRoutes=require('./routes/section')
const teachersRoutes=require('./routes/teachers')

mongoose.connect('mongodb+srv://Bali:DiNeSh5@cluster0.j1daf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',()=>{
    console.log("DB Connected..........")
})

const app=express();

app.use(bodyParser.json())
app.use(cors())


app.use("/api",sectionRoutes);
// app.use("/api",teachersRoutes);


app.listen(3000,()=>{
    console.log("App is running..........")
})