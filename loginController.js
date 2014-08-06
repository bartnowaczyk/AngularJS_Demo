angular.module('example.com.controllers', [])
    .controller('loginSpeakerController',['$scope', '$http','ipCookie', 'UserService', function ($scope, $http, ipCookie, User) {
    	var er = ipCookie('CSis_error');
    	var des = ipCookie('CSerror_type');
  		$scope.Alert=false;	
  		$scope.errorD= "";
    	if(er!==undefined) {
	  		$scope.Alert=true;	
	  		$scope.errorD= des;
	  		console.log(er);
	  	}
		var defaultUser = {email: '', password: '', remember: 'false'};
		$scope.userN = defaultUser;
		var rememberCook = ipCookie('CSPresenterRemember');
		var emailCook = ipCookie('CSPresenterEmail');
		var passwordCook = ipCookie('CaSPresenterPassword');
		var currentEvent = "";
		if (rememberCook=='yes' && emailCook && passwordCook){
				$scope.userN.email=emailCook;
				$scope.userN.password=passwordCook;
		}
		$scope.submitLogin = function(userN){
			if (userN.remember==true){
				ipCookie('CSPresenterRemember', 'yes', { expires:365})
				ipCookie('CSPresenterEmail', userN.email, { expires: 365 });
				ipCookie('CSPresenterPassword', userN.password, { expires: 365 });
			}
			$http.get('http://example.com/loginPresenter', {params: {email: userN.email, password: userN.password}}).
				success(function(data){
					if(data.status === 'ok') {
						var sep = " ";
						ipCookie('currentSession', data.currentEvent);
						ipCookie('userToken', data.token);
						ipCookie('userName', data.name);
						ipCookie.remove('CSis_error');
						ipCookie.remove('CSerror_type');
						if (data.firstrun==1)
							var url = 'http://example.com/main.html#/pevent/'.concat(data.currentEvent);
						else
							var url = 'http://example.com/signup.html';
						window.location.assign(url);
					}
					else {
						$scope.Alert = true;
						$scope.errorD = data.description;
						User.isUser=false;
						User.token='';
						$scope.userN = defaultUser;							
					}
				})
				.error (function(data, status, headers, config){
						$scope.Alert = true;
						$scope.errorD = "Cannot connect to database";
				})
			}
	$scope.closeThis = function(){
		$scope.Alert = false;
		$scope.errorD = "";
		ipCookie.remove('CSis_error');
		ipCookie.remove('CSerror_type');
	}

	var linkedInLogin = function (email, id){
		if (email == "" && email == undefined || id == "" && id == undefined){

		}
		else {
			$http.get('http://example.com/loginPresenterLinkedIn', {params: {email: email, linkedin: id}}).
				success(function(data){
					if(data.status === 'ok') {

						console.log(data);
						var sep = " ";
						ipCookie('currentSession', data.currentSession);
						ipCookie('userToken', data.token);
						ipCookie('userName', data.name);
						ipCookie.remove('CSis_error');
						ipCookie.remove('CSerror_type');
						var url = 'http://example.com/main.html#/pevent/'.concat(data.currentSession);
//						window.location.assign(url);
					}
					else {
						$scope.Alert = true;
						$scope.errorD = data.description;
						User.isUser=false;
						User.token='';
						$scope.userN = defaultUser;							
					}
				})
				.error (function(data, status, headers, config){
						$scope.Alert = true;
						$scope.errorD = "Cannot connect to database";
				})


		}

	}

	$scope.getLinkedInData = function() {
		if(!$scope.hasOwnProperty("userprofile")){
			IN.API.Profile("me").fields(
					[ "id","emailAddress", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl" ]).result(function(result) {
				linkedInLogin(result.values[0].emailAddress, result.values[0].id);				
			}).error(function(err) {
				$scope.error = err;
			});
		}
	};

}])