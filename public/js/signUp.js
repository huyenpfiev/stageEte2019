
var signUp = angular.module("signUp", []);
signUp.controller("signUpController", function($scope,$http) {

    console.log($scope.formData);
    $scope.checkSignUp = function() {
        
        $http.post('/checkSignUp', $scope.formData)
            .success(function(data) {
                if(data.error==true){
                    $scope.error="Please fill out all fields!";
                }
                else{
                    if(data.success){
                        $scope.error="Successful!";
                        window.location="login.html";
                        
                    }
                    else{
                        $scope.error="This username already existed!";
                    }
                        
                }
                
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    
});
