
var main = angular.module('main', []);

var userID={
    _id:localStorage.getItem("userID")
}

main.controller("mainController", function($scope,$http,$window) {
    $scope.taskSet={};
    $scope.studentName="";
    $scope.category="";
    $scope.imported=false;
    $scope.modalIndex=null;
    $scope.commentList={};
    // when landing on the page, get all todos and show them
    
    $http.post('/getTaskSet',userID).then(function(res) {
        $scope.taskSet = res.data;
        $http.post('/getStudentName',userID).then(function(res){
            $scope.studentName=res.data[0].lastName;  
        }); 
    });
    $scope.import=function(){
        $http.get('/importCSVFile').then(function(res){
            console.log(res);
        });
    };
    $scope.start=function(task){
        var IDs={
            id1: task._id,
            id2: userID._id
        }  
        $http.post('/updateDone',IDs).then(function(res){
            $scope.taskSet=res.data;
            
        });
    };
    

    $scope.ajouter = function(){
        var fichier = document.getElementById('fichier').files[0];
        $scope.file={
            name: fichier.name
        };
        $http.post('/saveFileName',$scope.file).then(function(res){
            console.log(res.data);
        });
    };
    $scope.analyseBrain=function(){
        window.location="http://localhost:8100";
    };
    $scope.seeCmts=function(task,index){
        $scope.modalIndex=index;
        $http.post('/getComments',task).then(function(res){
            $scope.commentList=res.data;
        });
    };
    
    
    // $scope.Update= function () {
    //         if (typeof (FileReader) != "undefined") {
    //             var reader = new FileReader();
    //             //For Browsers other than IE.
    //             if (reader.readAsBinaryString) {
    //                 reader.onload = function (e) {
    //                     $scope.ProcessExcel(e.target.result);
    //                 };
    //                 reader.readAsBinaryString($scope.fichier);
    //             } else {
    //                 //For IE Browser.
    //                 reader.onload = function (e) {
    //                     var data = "";
    //                     var bytes = new Uint8Array(e.target.result);
    //                     for (var i = 0; i < bytes.byteLength; i++) {
    //                         data += String.fromCharCode(bytes[i]);
    //                     }
                        
    //                     $scope.ProcessExcel(data);
    //                 };
    //                 reader.readAsArrayBuffer($scope.fichier);
    //             }
    //         } else {
    //             $window.alert("This browser does not support HTML5.");
    //         }
        
    // };

    // $scope.ProcessExcel = function (data) {
    //     //Read the Excel File data.
    //     var workbook = XLSX.read(data, {
    //         type: 'binary'
    //     });
        
    //     //Fetch the name of First Sheet.
    //     var firstSheet = workbook.SheetNames[0];
    //     //Content of excel file
    //     var content={
    //         data: workbook.Sheets[firstSheet]
    //     }
    //     //Read all rows from First Sheet into an JSON array.
    //     var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    //     //Display the data from Excel file in Table.
    //     $scope.$apply(function () {
    //         $scope.Customers = excelRows;
    //         $scope.IsVisible = true;
    //     });
    // };
   


    
    
});
