const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema;

const TeacherSchema=mongoose.Schema({
    t_name:{
        type:String,
        required:true
    },
    section:{
        type:ObjectId,
        ref:"Section"
    },
    subject:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    count:{
        type:Number,
        default:0
    },
    feedbackFromStudents:{
        type:Array,
        default:[]
    },
    messageFromManagement:{
        type:Array,
        default:[]
    },
    photo:{
        type:String
    }
})

module.exports=mongoose.model("Teacher",TeacherSchema)