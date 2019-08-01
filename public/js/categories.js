var userID={
    _id:localStorage.getItem("userID")
}
var stID={
    _id:localStorage.getItem("stID")
}
angular.module('categories', []).controller('categoryController', function ($scope, $http) {
    $scope.form= {};
    
    $http.post('/getTeacherName',userID).then(function(res){
        $scope.teacherName=res.data[0].lastName;  
    }); 
    $scope.cancel=function(){
        $scope.form={};
    }
    $scope.addTask=function(number){
        if(number==1)
            content=form.music;
        else if(number==2)
            content=form.email;
        else if(number==3)
            content=form.internet;
        else content=form.game;
        var data={
            category:number,
            content:content
        }
        $http.post('/addTask',data).then(function(res){
            $scope.form={};
        });
        
    }
});
  