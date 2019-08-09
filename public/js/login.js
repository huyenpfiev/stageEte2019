
var login = angular.module("login", []);
login.controller("loginController", function($scope,$http) {
    
    $scope.checkLogin = function() {
        $http.post('/checkLogin', $scope.formData)
            .success(function(data) {
                if(data.error == true){
                    $scope.error="Please fill out all fields!";
                }
                else{
                    if(data.success){
                        $scope.error="Successful!";
                        localStorage.setItem("userID",data.id);
                        if(data.role==1){
                            window.location="studentList.html";
                        }
                        else
                            window.location="toDoList.html";
                    }
                    else{
                        $scope.error="Invalid!";
                    }
                }
                
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    
});
