var userID={
    _id:localStorage.getItem("userID")
}
angular.module('todolist', []).controller('studentController', function ($scope, $http) {
    $scope.formData = {};
    $scope.form= {};
    $scope.clickedRow=false;
    $scope.pressedBtt=false;
    $scope.taskList={};
    $scope.modalIndex=null;
    $scope.newContent="";
    $http.get('/getStudentList').then(function(res) {
            $scope.students = res.data;
            $http.post('/getTeacherName',userID).then(function(res){
                $scope.teacherName=res.data[0].lastName;  
            }); 
        });
     
    $scope.detail=function(student){
            $scope.clickedRow=true;
            var ids={
                studentID:student._id,
                teacherID:userID._id
            }
            $http.post('/getTaskList',ids).then(function(res){
                $scope.taskList=res.data;
                });
            $http.post('/getStudentInfo',ids).then(function(res){
                $scope.info=res.data;
            });
    };
    $scope.deleteTodo=function(id){
        $http.delete('/deleteTask/'+id).then(function(res){
            $scope.taskList=res.data;
        });
    };
    $scope.search=function(formData){
        $http.post('/search',formData).then(function(res){
            $scope.students=res.data;
            $scope.formData={};
            $scope.clickedRow=false;
            $scope.pressedBtt=false;
        });
    };
  
    $scope.addTask=function(number){
        if(number==1)
            content=$scope.form.music;
        else if(number==2)
            content=$scope.form.email;
        else if(number==3)
            content=$scope.form.internet;
        else content=$scope.form.game;
        var data={
            category:number,
            content:content
        }
        $http.post('/addTask',data).then(function(res){
            $scope.taskList=res.data;
            $scope.form={};
        
        });
        
    }
    $scope.openModal=function(index){
    	$scope.modalIndex=index;
    	setTimeout(function (){
            document.getElementById('editInput').focus();
        }, 500);
    };
    $scope.closeModal=function(content){
    	$scope.newContent=content;
    };
	
    //update a task
    $scope.updateTodo = function(task) {
        var task={
            _id:task._id,
            new_name:$scope.newContent
        }
        $http.put('/updateTask', task).then(function(res){
            $scope.taskList = res.data;
            $('#exampleModal').modal('hide');
	        $scope.newContent="";
        });
    };
    
    
          
            

            
});