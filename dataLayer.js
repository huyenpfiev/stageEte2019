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
            cb();
            
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
    getGroupLists:function(userID,cb){
        
        db.collection("Lists").find({creator_id:new ObjectID(userID)}).toArray(function(err,docs){
            cb(docs);
        });
    },
    insertProject:function(project,cb){
        db.collection("Lists").insertOne(project,function(err,result){
            cb();
        });
    },
    deleteProject:function(name,userID,cb){
        
        db.collection("Lists").deleteOne({creator_id: new ObjectID(userID),name_list:name},function(err,result){
            db.collection("Task").deleteMany({user_id: new ObjectID(userID),list_name:name},function(err,result){
                cb();
            });
            
        });
    },
 
    updateDone:function(id,done,cb){
        db.collection("Task").updateOne({_id : new ObjectID(id)},{$set:{done:done}},function(err,result){
            cb();
        });

    }
}
module.exports=dataLayer;