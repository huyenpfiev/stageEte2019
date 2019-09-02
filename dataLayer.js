var MongoClient=require('mongodb').MongoClient;
var uri="mongodb+srv://DinhHuyen:Huyendien13-08@cluster0-mlysy.mongodb.net/ToDoList?retryWrites=true";

var client=new MongoClient(uri,{useNewUrlParser:true});
var db;
ObjectID=require('mongodb').ObjectID;

// connexion a la db 
var dataLayer={
    init:function(cb){
        client.connect(function(err){
            if(err) throw err;
            db=client.db("ToDoList");
            cb();
        });
    },
    checkLogin:function(acc,cb){
        
        db.collection("Teachers").find({userName:acc.user,password:acc.pass}).toArray(function(err, result1){

            if(result1.length == 1){
                cb(true,result1[0]._id,1);
            }
            else{
                db.collection("Students").find({userName:acc.user,password:acc.pass}).toArray(function(err, result2){
                    if(result2.length == 1){
                        cb(true,result2[0]._id,2);
                    }
                    else
                        cb(false,0,0);
                });
            }
        });
            
    },
    checkSignUp:function(role,acc,cb){
        if(role=="teacher"){
            db.collection("Teachers").find({userName:acc.userName}).toArray(function(err, result){

                if(result.length == 1){
                    cb(false);
                }
                else{
                    db.collection("Teachers").insertOne(acc,function(err,result){
                        cb(true);
                    });
                }
            });
        }
        else{
            db.collection("Students").find({userName:acc.userName}).toArray(function(err, result){

                if(result.length == 1){
                    cb(false);
                }
                else{
                    db.collection("Students").insertOne(acc,function(err,result){
                        cb(true);
                    });
                }
            });
        }
        
            
    },
    getStudentList:function(cb){
        
        db.collection("Students").find().toArray(function(err,docs){
            cb(docs);
        });
    },
    getTeacherName:function(teacherID,cb){
        db.collection("Teachers").find({_id:new ObjectID(teacherID)}).toArray(function(err,docs){
            cb(docs);
        });
    },
    getTaskList:function(studentID,teacherID,cb){
        
        db.collection("Task").find({
                student_id:new ObjectID(studentID),
                teacher_id:new ObjectID(teacherID)
            }).toArray(function(err,docs){
            cb(docs);
        });
    },
    getStudentInfo:function(studentID,cb){
        db.collection("Students").find({_id:new ObjectID(studentID)}).toArray(function(err,docs){
            cb(docs[0]);
        });
    },
    deleteTask:function(id,cb){
        
        db.collection("Task").deleteOne({_id: new ObjectID(id)},function(err,result){
            db.collection("Comments").deleteMany({taskID:new ObjectID(id)},function(){
                cb();
            });
            
        });
    },
    search:function(name,cb){
        db.collection("Students").find({ 
            $or: [ 
                { firstName: {$regex: name, $options: 'i'} },
                { lastName:  {$regex: name, $options: 'i'} } 
            ] 
               
        }).toArray(function(err,docs){
            cb(docs);
        });
    },
    insertTask:function(task,cb){
        db.collection("Task").insertOne(task,function(err,result){
            cb();
        });
    },
    updateTask:function(id,new_name,cb){     
        db.collection("Task").updateOne({_id : new ObjectID(id)},{$set:{name:new_name,date:new Date()}},function(err,result){
            cb();
        });

    },
    getTaskSet:function(stID,cb){
        db.collection("Task").find({student_id:new ObjectID(stID)}).toArray(function(err,result){
            cb(result);
        });
    },
    getStudentName:function(stID,cb){
        db.collection("Students").find({_id:new ObjectID(stID)}).toArray(function(err,result){
            cb(result);
        });
    },
    updateDone:function(id,cb){
        db.collection("Task").updateOne({_id : new ObjectID(id)},{$set:{done:true}},function(err,result){
            cb();
        });

    },
    addComment:function(comment,cb){
        db.collection("Comments").insertOne(comment,function(err,result){
            cb(result);
        });
    },
    getComments:function(id,cb){
        db.collection("Comments").find({taskID:new ObjectID(id)}).toArray(function(err,result){
            cb(result);
        });
    },
    importCSVFile:function(cb){
        let exec = require('child_process').exec;
        let command= "mongoimport --uri \""+ uri +"\" --collection ExcelData --type csv --file museMonitor.csv --headerline";
        exec(command, (err, stdout, stderr) => {
            // check for errors or if it was succesfuly
            console.log(stdout);
            console.log(stderr);
            cb(command);
            if (err) throw err;         
        });
    }
    
}
module.exports=dataLayer;