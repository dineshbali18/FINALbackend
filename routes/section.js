const express=require('express');
const router=express.Router();
const https=require("https");
const axios=require("axios")

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
    console.log(req.body);
    // console.log(req.sec._id);
    // req.body.teacher.section=req.sec._id;
    const teacher=new Teacher({
        t_name:req.body.t_name,
        section:req.sec._id,
        subject:req.body.subject,
        photo:req.body.photo,
        t_id:req.body.t_id
    });
    console.log(teacher);
    teacher.save((err,teach)=>{
        if(err){
            console.log(err);
            return res.json({
                error:"Failed to save in DB"
            })
        }
        else{
            async function addToRemaining(){
                let payload={subject:req.body.subject,section:req.sec}
                let res=await axios.post('https://userda.herokuapp.com/api/section/add/remainingsubjects',payload);
            }
            addToRemaining();

            // fetch(`${API}/api/section/add/remainingsubjects`, {
            //     method: "POST",
            //     headers: {
            //       Accept: "application/json",
            //       "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(teacher.subject)
            //   })
        }
        res.json(teach);
    })
    

})


//teachers login
router.get("/data/teacher/sections/:teacherId",(req,res)=>{
    console.log(req.teacher)
    
    Teacher.find({t_id:req.teacher}).populate("section","s_name").exec((err,data)=>{
        if(err){
            return res.json(err);
        }
        console.log(data);
        var resultArr=[];
        for(var i=0;i<data.length;i++){
            var resObj={};
            resObj.section=data[i].section.s_name;
            resObj.subject=data[i].subject;
            resObj.feedbackFromStudents=data[i].feedbackFromStudents;
            resObj.messageFromManagement=data[i].messageFromManagement;
            if(data[i].count==0){
            resObj.rating=0;
            }
            else{
            resObj.rating=(data[i].rating/data[i].count);
            }
            resultArr.push(resObj);
        }
        return res.json(resultArr);
    }
    )
})


//display feedback to teachers
router.get("/feedback/teachers/",(req,res)=>{
    Teacher.find({t_id:req.body.id}).exec((err,data)=>{
        if(err){
            console.log(err);
        }
        return res.json(data);
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

//get req to get name
router.get("/get/name/:teacherId",(req,res)=>{
    Teacher.findById({_id:req.teacher}).exec((err,tdata)=>{
        if(err){
            return res.json("Error in finding name")
        }
        else{
            return res.json(tdata.name);
        }
    })
})



//very very important
// router.get("/remaining/teachers",(req,res)=>{
//     // const remainingData=new Set();
//     const res=await axios.get("/get/remaining/subjects/:userId");
//     console.log(res.data);
// })

module.exports=router;