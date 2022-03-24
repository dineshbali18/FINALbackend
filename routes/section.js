const express=require('express');
const router=express.Router();


//models
const Section=require('../models/sections');
const Teacher=require('../models/teachers')


//name ========== id
router.param("sectionId",(req,res,next,name)=>{
    Section.findOne({s_name:name}).exec((err,section)=>{
        if(err){
            return res.json({
                error:"No section Found"
            })
        }
        // console.log("......................................")
        // console.log(section);
        // console.log("......................................")
        req.sec=section;
        next();
    })
});

router.param("teacherId",(req,res,next,id)=>{
    req.teacher=id;
    next();
})

router.post("/create/section",(req,res)=>{
    // console.log(req.body)
    const sec=new Section(req.body);
    sec.save().then((err,sect)=>{
        console.log(sect);
        if(err){
            return res.json(err);
        }
        else{
        // console.log(sect);
        return res.json(sect)
        }
        return res.json("Already present...")
    })
})

//add teachers to section
router.post("/section/teachers/section/:sectionId",(req,res)=>{
    // console.log(req.body);
    // console.log(req.sec._id);
    // req.body.teacher.section=req.sec._id;
    const teacher=new Teacher({
        t_name:req.body.t_name,
        section:req.sec._id,
        subject:req.body.subject,
        photo:req.body.photo
    });
    teacher.save((err,teach)=>{
        if(err){
            console.log(err);
            return res.json({
                error:"Failed to save in DB"
            })
        }
        res.json(teach);
    })
    

})
//getting all teachers using section id
router.get("/section/teachers/section/:sectionId",(req,res)=>{
    console.log(req.sec._id);
    Teacher.find({section:req.sec._id}).exec((err,data)=>{
        if(err){
            console.log(err);
        }
        return res.json(data);
    })


})

//collecting ratings from users
router.post("/teacher/ratings/:teacherId",(req,res)=>{
    Teacher.findOneAndUpdate({_id:req.teacher},{$inc:{rating:req.body.rating}}).exec((err,tea)=>{
        if(err){
            return res.json("Error in updating Ratings")
        }
        else{
            Teacher.findByIdAndUpdate({_id:req.teacher},{$inc:{count:1}}).exec((err,suc)=>{
                if(err){
                    return res.json("Error in Updating Count")
                }
            })
            return res.json("feedback submitted")
        }
    })
})


//collecting feedback from users
router.post("/teacher/feedback/:teacherId",(req,res)=>{
    var s=req.body.msg;
    Teacher.findByIdAndUpdate(req.teacher,{"$push":{"feedbackFromStudents":s}},{ "new": true, "upsert": true }).exec((err,tea)=>{
        if(err){
            return res.json("Error in updating Ratings")
        }
        else{
            // [...tea.feedbackFromStudents,req.body.msg]
            // tea.feedbackFromStudents.push(req.body.msg)
            return res.json(tea)
        }
    })
})

//collecting feedback from management
router.post("/teacher/feedback/management/:teacherId",(req,res)=>{
    var s=req.body.msg;
    Teacher.findByIdAndUpdate(req.teacher,{"$push":{"messageFromManagement":s}},{ "new": true, "upsert": true }).exec((err,tea)=>{
        if(err){
            return res.json("Error in updating Ratings")
        }
        else{
            // [...tea.feedbackFromStudents,req.body.msg]
            // tea.feedbackFromStudents.push(req.body.msg)
            return res.json(tea)
        }
    })
})

//sending feeback to teacher
router.get("/get/feedback/:teacherId",(req,res)=>{
    Teacher.findById(req.teacher).exec((err,data)=>{
        if(err){
            return res.json("Error in Getting Feedback")
        }
        else{
        res.json(data.feedbackFromStudents);
        }
    })
})

module.exports=router;