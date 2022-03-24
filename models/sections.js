const mongoose=require('mongoose')

const sectionSchema=mongoose.Schema({
    s_name:{
        type:String,
        unique:true,
        require:true,
    }
})

module.exports=mongoose.model("Section",sectionSchema);
