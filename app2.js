var dataLayer=require('./dataLayer.js');//dataLayer
//server web
var express=require('express');
var path=require('path');
var app=express();
var cors=require('cors');
var bodyParser =  require('body-parser');// lors de l'utilisation  de app on peut recuperer des saisie faite cote client 
//init parser
app.use(bodyParser.json());//to support Json encoded bodies
app.use(bodyParser.urlencoded({extended:true})); //to support URL encoded bodies
app.use(cors());
//
var studentID;
var teacherID;
var excelFileName;
ObjectID=require('mongodb').ObjectID;

//start the application after the database connection is ready
dataLayer.init(function(){
    var port = process.env.port || 3000;
    app.listen(port);
    console.log("Listening on port 3000");
});


app.use(express.static(path.join(__dirname,'public'))); 
app.use(express.static(path.join(__dirname,'CSVFiles'))); 
app.get('/', function(req, res) {
    res.sendFile('./public/index.html'); 
});

//login
app.post('/checkLogin',function(req,res){
    var acc={
        user:req.body.user,
        pass:req.body.pass
    }
    if(typeof acc.user && typeof acc.pass !='undefined'){
        dataLayer.checkLogin(acc,function(found,id,role){
            res.send({ success: found, id: id, role:role });
        });
    }
    else
    {
        res.send({
            error:true,
        });
    }
    
});
//sign up
app.post('/checkSignUp',function(req,res){
    var acc={ 
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        userName:req.body.user,
        password:req.body.pass
    }
    var role=req.body.role
    if(typeof role && typeof acc.firstName && typeof acc.lastName && typeof acc.userName && typeof acc.password !='undefined'){
        dataLayer.checkSignUp(role,acc,function(found){
            res.send({ success: found});
        });
    }
    else
    {
        res.send({
            error:true,
        });
    }
});
//send all students
app.get("/getStudentList",function(req,res){
    
    dataLayer.getStudentList(function(dtSet){
        res.send(dtSet);
    });
});
app.post("/getTeacherName",function(req,res){
    teacherID=req.body._id;
    dataLayer.getTeacherName(teacherID,function(dtSet){
        res.send(dtSet);
    });
});
//send all tasks
app.post("/getTaskList",function(req,res){
    studentID=req.body.studentID;
    teacherID=req.body.teacherID;
    dataLayer.getTaskList(studentID,teacherID,function(dtSet){
        res.send(dtSet);
    });
});
app.post("/getStudentInfo",function(req,res){
    studentID=req.body.studentID;
    dataLayer.getStudentInfo(studentID,function(dtSet){
        res.send(dtSet);
    });
});
//delete a task
app.delete("/deleteTask/:id",function(req,res){
    var id=req.params.id;
    dataLayer.deleteTask(id,function(){
        dataLayer.getTaskList(studentID,teacherID,function(dtSet){
            res.send(dtSet);
        });  
    });
});
//search student
app.post("/search",function(req,res){
    var name=req.body.name;
    dataLayer.search(name,function(dtSet){
        res.send(dtSet);
    });
});
//insert task
app.post('/addTask',function(req,res){
    if(req.body && typeof req.body.content !='undefined'){
        var task={
            teacher_id:new ObjectID(teacherID),
            student_id:new ObjectID(studentID),
            name:req.body.content,
            done:false,
            date:new Date(),
            category:req.body.category
        };      
        dataLayer.insertTask(task,function(){
            dataLayer.getTaskList(studentID,teacherID,function(dtSet){
                res.send(dtSet);
            });                    
        });
    }
    else{
        res.send({
            success:false,
            errorCode:"PARAM_MISSING"
            
        });
    }
});
//add a task for many students
app.post('/addForManySts',function(req,res){
    req.body.students.forEach(function(student){
        var task={
            teacher_id:new ObjectID(teacherID),
            student_id:new ObjectID(student._id),
            name:req.body.data.content,
            done:false,
            date:new Date(),
            category:req.body.data.category
        };      
        dataLayer.insertTask(task,function(){

        });
    });
    res.send("OK");
          
});
//update task
app.put("/updateTask",function(req,res){
    var id=req.body._id;
    var new_name=req.body.new_name;

    if(typeof new_name != 'undefined'){
        dataLayer.updateTask(id,new_name,function(){
            dataLayer.getTaskList(studentID,teacherID,function(dtSet){
                res.send(dtSet);
            }); 
        });
    }
    else{
        res.send({
            success:false,
            errorCode:"PARAM_MISSING"    
        });
    }
    
});

//send all tasks of  a student
app.post("/getTaskSet",function(req,res){
    var stID=req.body._id;
    var docs= [];
    var n=0;
    dataLayer.getTaskSet(stID,function(tasks){
        tasks.forEach(function(task){
            var element={};
            element.task=task;  
            dataLayer.getTeacherName(task.teacher_id,function(teacher){
                element.teacher=teacher; 
                docs.push(element);   
                n++;
                if(n==tasks.length){
                    res.send(docs);
                }
            });
  
        });
    });
});

app.post("/getStudentName",function(req,res){
    var stID=req.body._id;
    dataLayer.getStudentName(stID,function(dtSet){
        res.send(dtSet);
    });
});

//update Done
app.post("/updateDone",function(req,res){
    var id1=req.body.id1;
    var stID=req.body.id2;
    var docs= [];
    var n=0;
    dataLayer.updateDone(id1,function(){       
        dataLayer.getTaskSet(stID,function(tasks){
            tasks.forEach(function(task){
                var element={};
                element.task=task;  
                dataLayer.getTeacherName(task.teacher_id,function(teacher){
                    element.teacher=teacher; 
                    docs.push(element);   
                    n++;
                    if(n==tasks.length){
                        res.send(docs);
                    }
                });
      
            });
        });
    });
});
//add a comment
app.post("/addComment",function(req,res){
    var comment={
        taskID: new ObjectID(req.body.id),
        content:req.body.content
    }
    dataLayer.addComment(comment,function(dtSet){
        res.send(dtSet);
    });
});
//get comments
app.post("/getComments",function(req,res){
    var id=req.body._id;
    dataLayer.getComments(id,function(dtSet){
        res.send(dtSet);
    });
});
app.get("/importCSVFile",function(req,res){
    dataLayer.importCSVFile(function(dtSet){
        res.send(dtSet);
    });
});
app.post("/saveFileName",function(req,res){
    excelFileName=req.body.name;
    res.send(excelFileName);
});
app.get('/transmitParam',function(req,res){
    res.send(JSON.parse(JSON.stringify(excelFileName)));
});

  



