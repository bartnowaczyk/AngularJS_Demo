'use strict';

/* Controllers */

angular.module('example.com.controllers', [])

.run(function($rootScope) {
    $rootScope.curEvent = 0;
})


.controller('mainController', ['$scope', '$http','ipCookie', '$modal', 'UserService', '$location', '$rootScope', function($scope, $http, ipCookie, $modal, User, $location, $rootScope) {
	$scope.selEv = "menu_btn_sel";
	$scope.selSt = "menu_btn";
	$scope.selBi = "menu_btn";
	var userToken = ipCookie('userToken');
	var newEvent = ipCookie('newEvent');
	var prot = ipCookie('CSprotected');
	$rootScope.curEvent = ipCookie('currentEvent');

	$scope.getEv = function() {
        return $rootScope.curEvent;
    };

	if (userToken===undefined) {
		window.location.assign('http://example.com/');
	}
	else {
		var userToken = ipCookie('userToken');
		$http.get('http://example.com/showAccount?token=test', {params: {token: userToken}}).
			success(function(data){
				if (data.status=="ok"){
					$scope.user = {userName: '', id: '', password: "aaaaaaaaaaaa", company: "bb" };
					$scope.user.userName = data.firstname.concat(" ").concat(data.lastname);
					$scope.user.id = data.id;
//					$scope.user.password = data.password;
//					$scope.user.company = data.companyName;
					$scope.userName=$scope.user.userName;
				}
				else { 
	 				if (data.description=="bad_token") {
						ipCookie('error', "Session Expired");
						window.location.assign('http://example.com/');
					}
				}
			})
			.error (function(data, status, headers, config){
				alert("Cannot connect do database");
			});
		$scope.change = function(a) {
			if (a=="event"){
				$scope.selEv = "menu_btn_sel";
				$scope.selSt = "";
				$scope.selBi = "";
			}
				
			
			if (a=="stat"){
				$scope.selEv = "";
				$scope.selSt = "menu_btn_sel";
				$scope.selBi = "";
			}
			
			if (a=="billing"){
				$scope.selEv = "";
				$scope.selSt = "";
				$scope.selBi = "menu_btn_sel";				
			}

		}
	if (newEvent==true)
	  var modalPromise = $modal({
	      template: 'partials/tutorial.html',
	      show: true,
	      persist: true,
	      backdrop: false,
	      modalClass: 'modal-full',
	      scope: $scope
	    });
	}
	if (prot==true){
			$scope.token = userToken;
			$scope.evId = $scope.curEvent ;
		    var modalPromise = $modal({
		      template: 'partials/password.html',
		      show: true,
		      persist: true,
		      backdrop: 'static',
		      modalClass: 'modal-narrow',
		      scope: $scope
		    });
	}

}])

.controller('eventPasswordController', ['$scope', '$http','ipCookie', function($scope, $http, ipCookie){

	$scope.sendPassword = function(ev){
		var evId = $scope.evId;
		$scope.abc = "ok";
		var userToken = ipCookie('userToken');
		var url = "http://example.com/showEvent/" + evId;
		$http.get(url, {params: {token: userToken, password: ev.password}}).
		success(function(data){
			if (data.status ==='ok'){
				var params = {params: {currentEvent: evId, token: userToken}}
				$http.get('http://example.com/updateAccount', params).
				success(function(data){
				})
				.error (function(data, status, headers, config){
					alert("Cannot connect do database");
				})
				var url2 = 'http://example.com/main.html#/event/' + evId;
				ipCookie('currentEvent', evId);
				ipCookie('currentEventName', data.name);
				
				window.location.assign(url2);	
				ipCookie('abc', ev.password);
				$('.modal-narrow').modal('toggle');
				$('.modal-backdrop').remove();
				}	
		})
	}	

}])

.controller('eventListController',['$scope', '$http','ipCookie', 'UserService', '$modal', '$rootScope', function($scope, $http, ipCookie, User, $modal, $rootScope) {
	var app = this; 		
   	var er = ipCookie('CSis_error');
   	var des = ipCookie('CSerror_type');
	$scope.Alert=false;	
	$scope.errorD= "";
   	if(er!==undefined) {
  		$scope.Alert=true;	
  		$scope.errorD= des;
  	}
   	var inf = ipCookie('CSinfo');
	$scope.Info=false;	
	$scope.infoD= "";
   	if(inf!==undefined) {
  		$scope.Info=true;	
  		$scope.infoD= des;
  	}
	var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var userToken = ipCookie('userToken');
	var events;

	var getList = function() {
		$scope.events = null;
		$http.get('http://example.com/listEvents', {params: {token: userToken	}}).
		success(function(data){
			var e = data;
			for(var k in e){
				if (k!=="status") {
					if (e[k].startDate!='0'){
						var s = new Date(e[k].startDate*1000);
						var startYear = s.getFullYear().toString();
						var startMonth = m_names[(s.getMonth())];
						var startDay= s.getDate().toString();

						if(startDay=="1" || startDay=="21" || startDay=="31"){
							startDay = startDay.concat("st");
						}
						else if(startDay=='2' || startDay=='22') {
							startDay = startDay.concat("nd");	
						}
						else if(startDay=='3' || startDay=='23'){
							startDay = startDay.concat("rd");
						}
						else{
							startDay = startDay.concat("th");
						}
						e[k].startDate = startMonth.concat(" ").concat(startDay).concat(" ").concat(startYear);
					}
					else
						e[k].startDate ='';	
				}
				else
					delete e[k]; 
				
						$scope.events = e;
						events = e;
			}

		})
		.error (function(data, status, headers, config){
			alert("Cannot connect do database");
		});

	}
	getList();

	$scope.changeEvent = function(event) {
			ipCookie('CSprotected', 'false');
			var url = 'http://example.com/main.html#/event/';
			var od = event.id.toString();
			var url = url.concat(od);
			ipCookie('currentEvent', event.id);
			$rootScope.curEvent = event.id;
			var params = {params: {currentEvent: event.id, token: userToken}}
			$http.get('http://example.com/updateAccount', params).
			success(function(data){
			})
			.error (function(data, status, headers, config){
				alert("Cannot connect do database");
			})

			ipCookie('currentEventName', event.name);
			$scope.curEvent = event.id;
			window.location.assign(url);
	}

	$scope.delete = function(event) {
			var answer = confirm("Are you sure you want to delete this event?");
			if (answer){
				var url = 'http://example.com/removeEvent/' + event.id;
				var params = {params: { token: userToken}}
				$http.get(url, params).
				success(function(data){
					getList();
					if (events[0].id!=event.id)
						$scope.changeEvent(events[0]);	
					else
						$scope.changeEvent(events[1])
				})
				.error (function(data, status, headers, config){
					alert("Cannot connect do database");
				})
			}
	}


	var showEventPassModal = function (id, token){
		$scope.token = token;
		$scope.evId = id;
	    var modalPromise = $modal({
	      template: 'partials/password.html',
	      show: true,
	      persist: true,
	      backdrop: 'static',
	      modalClass: 'modal-narrow',
	      scope: $scope
	    });
	}
	

}])

.controller("sessionListController", ['$scope', '$http','ipCookie', '$routeParams', '$modal', 'Hour', function($scope, $http, ipCookie, $routeParams, $modal, Hour){
	var app = this;	
	$scope.active1 = 0;
	$scope.block = "f";



	var id = ipCookie('currentEvent');
	$scope.evId = id;
	var userToken = ipCookie('userToken');
	$scope.token = userToken;

	var url = "http://example.com/showEvent/";
	var od = id.toString();
	var  u = url.concat (od);
	var abc = ipCookie("abc");
	var status;
	$http.get(u, {params: {token: userToken, password: abc}}).
		success(function(data){
					$scope.eventName = data.name;
					ipCookie("currentEventName", data.name);
					$scope.street = data.street;
					$scope.city = data.city;
					$scope.state = data.state;
					$scope.zip = data.zip;
					$scope.eventId= data.id;
					$scope.active1= data.active;
					if ($scope.active1==1)
						$scope.block ="n";		
					if(data.startDate!='0'){
						var s = new Date(data.startDate*1000);
						var startYear = s.getFullYear().toString();
						var startMonth = (s.getMonth()+1).toString();
						var startDay= s.getDate().toString();
						var startDate = startMonth.concat("/").concat(startDay).concat("/").concat(startYear);
						$scope.startDate= startDate;
					}
					else 
						$scope.startDate='';
					
					if(data.endDate!='0'){
						var k = new Date(data.endDate*1000);
						var endYear = k.getFullYear().toString();
						var endMonth = (k.getMonth()+1).toString();
						var endDay= k.getDate().toString();
						var endDate = endMonth.concat("/").concat(endDay).concat("/").concat(endYear);
						$scope.endDate= endDate;
					}
					else
						$scope.endDate= '';

					status =data.active;
		})
		.error (function(data, status, headers, config){
			alert("Cannot connect do database");
		});
	var url = "http://example.com/listSessions/";
	var  u = url.concat (od);
	$scope.speakers = [];
	$http.get(u, {params: {token: userToken}}).
		success(function(data){
			if (data.stats==="bad_token") {
				ipCookie('error_type', 'Session Expired');
				window.location.assign('http://example.com/');
			}
			else {
				$scope.sessions = data;
					for (var ses in data){
						if(data[ses].startTime !='0'){
							var st = data[ses].startTime.toString();
							if (st.length==3)
						   		st = "0".concat(st);		   	
							var sts = st.substring(0,2);
							var std = st.substring(2,4);
							$scope.sessions[ses].startTime = Hour.change(sts.concat(":").concat(std));
						}
						else {
							$scope.sessions[ses].startTime = '';
						}							
						if (data[ses].endTime!='0'){
							var et = data[ses].endTime.toString();
						   	if (et.length==3)
						   		et = "0".concat(et);
							var ets = et.substring(0,2);
							var etd = et.substring(2,4);
							$scope.sessions[ses].endTime = Hour.change(ets.concat(":").concat(etd));
						}
						else {
						$scope.sessions[ses].endTime = '';	
						}
						if(data[ses].date !='0')
						{
							var s = new Date(data[ses].date*1000);
							var startYear = s.getFullYear().toString();
							var startMonth = (s.getMonth()+1).toString();
							var startDay= s.getDate().toString();
							var startDate = startMonth.concat("/").concat(startDay).concat("/").concat(startYear);
							$scope.sessions[ses].date = startDate;
						} 
						else{
						$scope.sessions[ses].date = "";	
						}						

						$scope.sessions[ses].isPath = false;
						if ($scope.sessions[ses].path!="")
							$scope.sessions[ses].isPath = true;
					}
			}		
		})
		.error (function(data, status, headers, config){
			alert("Cannot connect do database");
		});

		$scope.changeActive = function (){
		if ($scope.active1==0){
			var url = "http://example.com/activateEvent/";
			var  u = url.concat ($scope.eventId);
			$http.get(u, {params: {token: userToken}}).
				success(function(data){
					if (data.stats==="bad_token") {
						ipCookie('error_type', 'Session Expired');
						window.location.assign('http://example.com/');
					}
					if (data.status==="ok"){
					}
				})
				.error (function(data, status, headers, config){
					alert("Cannot connect do database");
				});


		}
		if ($scope.active1 == 1 ) {
			var url = "http://example.com/deactivateEvent/";
			var  u = url.concat ($scope.eventId);
			$http.get(u, {params: {token: userToken}}).
				success(function(data){
					if (data.status==="bad_token") {
						ipCookie('error_type', 'Session Expired');
						window.location.assign('http://example.com/');
					}
					if (data.status==="ok"){
					}
				})
				.error (function(data, status, headers, config){
					alert("Cannot connect do database");
				});


		}
	}

	$scope.removeSes = function(session) {
		console.log('It works');
		var answer = confirm("Are you sure you want to delete this session?");
        if (answer==true) {
			var url = 'http://example.com/removeSession/'.concat(session.id);
			$http.get(url, {params: {token: userToken}}).
				success(function(data){
				if (data.status!="error"){
					var sessionsTemp = [];
					sessionsTemp = data;
						for (var ses in data){
							if(data[ses].startTime > 0){
								var st = data[ses].startTime.toString();
								if (st.length==3)
							   		st = "0".concat(st);		   	
								var sts = st.substring(0,2);
								var std = st.substring(2,4);
								sessionsTemp[ses].startTime = Hour.change(sts.concat(":").concat(std));
							}
							else {
								sessionsTemp[ses].startTime = '';
							}							

							if (data[ses].endTime>0){
								var et = data[ses].endTime.toString();
							   	if (et.length==3)
							   		et = "0".concat(et);
								var ets = et.substring(0,2);
								var etd = et.substring(2,4);
								sessionsTemp[ses].endTime = Hour.change(ets.concat(":").concat(etd));
							}
							else {
								sessionsTemp[ses].endTime = '';	
							}

							if(data[ses].date >0)
							{
								var s = new Date(data[ses].date*1000);
								var startYear = s.getFullYear().toString();
								var startMonth = (s.getMonth()+1).toString();
								var startDay= s.getDate().toString();
								var startDate = startMonth.concat("/").concat(startDay).concat("/").concat(startYear);
								sessionsTemp[ses].date = startDate;

							} 

							else{
								sessionsTemp[ses].date = "";	
							}						
							if(sessionsTemp[ses].path !="")
								sessionsTemp[ses].isPath = true;
							else {
								sessionsTemp[ses].isPath = false;
							}

							angular.copy(sessionsTemp, $scope.sessions);
						}
				}	
				else {
					if (data.description=="bad_token") {
						ipCookie('error', "Session Expired");
							window.location.assign('http://example.com/');
					}
				}
				})
				.error (function(data, status, headers, config){
				alert("Cannot connect do database");
				});		
		}        	
	}

	$scope.editSes = function (id) {
		var a = ipCookie("ActiveSession", id);
	}
	$scope.showMessageModal = function(mail, id) {
	$scope.sesMa = mail;
	$scope.sesId = id;
	  var modalPromise = $modal({
	      template: 'partials/message.html',
	      show: true,
	      persist: true,
	      backdrop: 'static',
	      modalClass: 'modal-narrow',
	      scope: $scope
	    });
	}

	$scope.showUploadModal = function(session) {
	$scope.session = session;
	$scope.path = session.path;
	  var modalPromise = $modal({
	      template: 'partials/presentation.html',
	      show: true,
	      persist: true,
	      backdrop: 'static',
	      modalClass: 'modal-wide',
	      scope: $scope
	    });
	}
	
	$scope.showAddSessionModal = function() {
	  var modalPromise = $modal({
	      template: 'partials/addsession.html',
	      show: true,
	      persist: true,
	      backdrop: 'static',
	      modalClass: 'modal-medium',
	      scope: $scope
	    });
	}

	$scope.showUpdateSessionModal = function(session) {
	$scope.ses = session;
	  var modalPromise = $modal({
	      template: 'partials/updatesession.html',
	      show: true,
	      persist: true,
	      backdrop: 'static',
	      modalClass: 'modal-medium',
	      scope: $scope
	    });
	}

	$scope.showTutorialModal = function() {
	  var modalPromise = $modal({
	      template: 'partials/tutorial.html',
	      show: true,
	      persist: true,
	      backdrop: false,
	      modalClass: 'modal-full',
	      scope: $scope
	    });
	}
}])

.service('Hour', [function () {

        return {
			
	 	change: function(h) {
   			var hours = [
		  	 {d: 'eg. 08:00 AM'},
		  	 {h: '08:00', d: '08:00 AM'},
		  	 {h: '08:15', d: '08:15 AM'},
		  	 {h: '08:30', d: '08:30 AM'},
		  	 {h: '08:45', d: '08:45 AM'},
		  	 {h: '09:00', d: '09:00 AM'},
		  	 {h: '09:15', d: '09:15 AM'},
		  	 {h: '09:30', d: '09:30 AM'},
		  	 {h: '09:45', d: '09:45 AM'},
		  	 {h: '10:00', d: '10:00 AM'},
		  	 {h: '10:15', d: '10:15 AM'},
		  	 {h: '10:30', d: '10:30 AM'},
		  	 {h: '10:45', d: '10:45 AM'},
		  	 {h: '11:00', d: '11:00 AM'},
		  	 {h: '11:15', d: '11:15 AM'},
		  	 {h: '11:30', d: '11:30 AM'},
		  	 {h: '11:45', d: '11:45 AM'},
		  	 {h: '12:00', d: '12:00 PM'},
		  	 {h: '12:15', d: '12:15 PM'},
		  	 {h: '12:30', d: '12:30 PM'},
		  	 {h: '12:45', d: '12:45 PM'},
		  	 {h: '13:00', d: '01:00 PM'},
		  	 {h: '13:15', d: '01:15 PM'},
		  	 {h: '13:30', d: '01:30 PM'},
		  	 {h: '13:45', d: '01:45 PM'},
		  	 {h: '14:00', d: '02:00 PM'},
		  	 {h: '14:15', d: '02:15 PM'},
		  	 {h: '14:30', d: '02:30 PM'},
		  	 {h: '14:45', d: '02:45 PM'},
		  	 {h: '15:00', d: '03:00 PM'},
		  	 {h: '15:15', d: '03:15 PM'},
		  	 {h: '15:30', d: '03:30 PM'},
		  	 {h: '15:45', d: '03:45 PM'},
		  	 {h: '16:00', d: '04:00 PM'},
		  	 {h: '16:15', d: '04:15 PM'},
		  	 {h: '16:30', d: '04:30 PM'},
		  	 {h: '16:45', d: '04:45 PM'},
		  	 {h: '17:00', d: '05:00 PM'},
		  	 {h: '17:15', d: '05:15 PM'},
		  	 {h: '17:30', d: '05:30 PM'},
		  	 {h: '17:45', d: '05:45 PM'},
		  	 {h: '18:00', d: '06:00 PM'},
		  	 {h: '18:15', d: '06:15 PM'},
		  	 {h: '18:30', d: '06:30 PM'},
		  	 {h: '18:45', d: '06:45 PM'},
		  	 {h: '19:00', d: '07:00 PM'},
		  	 {h: '19:15', d: '07:15 PM'},
		  	 {h: '19:30', d: '07:30 PM'},
		  	 {h: '19:45', d: '07:45 PM'},
		  	 {h: '20:00', d: '08:00 PM'},
		  	 {h: '20:15', d: '08:15 PM'},
		  	 {h: '20:30', d: '08:30 PM'},
		  	 {h: '20:45', d: '08:45 PM'},
		  	 {h: '21:00', d: '09:00 PM'},
		  	 {h: '21:15', d: '09:15 PM'},
		  	 {h: '21:30', d: '09:30 PM'},
		  	 {h: '21:45', d: '09:45 PM'},
		  	 {h: '22:00', d: '10:00 PM'},
		   	 ];	 	
		   	 for (var a in hours){
   	 			if (hours[a].h==h)
   	 				return hours[a].d;
   		 	}
	  	}
       };

    }]);




