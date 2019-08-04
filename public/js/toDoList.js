
var main = angular.module('main', []);

var userID={
    _id:localStorage.getItem("userID")
}

main.controller("mainController", function($scope,$http) {
    $scope.taskSet={};
    $scope.studentName="";
    $scope.category="";
    // when landing on the page, get all todos and show them
    
    $http.post('/getTaskSet',userID).then(function(res) {
        $scope.taskSet = res.data;
        $http.post('/getStudentName',userID).then(function(res){
            $scope.studentName=res.data[0].lastName;  
        }); 
    });
    
    
});
