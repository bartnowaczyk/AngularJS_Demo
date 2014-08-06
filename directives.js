'use strict';

/* Directives */


angular.module('evamole.com.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive('autoPersist', function($timeout, $http, ipCookie){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            console.log(scope.userName)

            elm.bind('blur', function () {
              attrs.ngModel.split('.')[attrs.ngModel.split('.').length-1]
              var mod = attrs.ngModel.split('.')[attrs.ngModel.split('.').length-1];
              if (mod == 'firstName'){
                 var model =  elm.val() + " " + scope.presenter.lastName;
                 mod = 'name';
              }
              else if (mod=='lastName'){
                var model = scope.presenter.firstName + " " + elm.val();
                mod = 'name'
              }
              else {
                var model = elm.val();
              }
              var url = "http://example.com/updatePresenter/";
              var userToken = ipCookie('userToken');
              var param = {token: userToken};
              param[mod] = model;
              $http.get(url, {params: param}).
                success(function(data){
                  if (data.status ==="ok"){
                    elm.addClass('saved');
                    //alert("Profile updated");
               
                    if (mod=='name'){
                      ipCookie('userName', model);
                      var scope2 = angular.element($("#namePanel")).scope();
                      setTimeout(function () {
                        scope2.$apply(function(){
                        scope2.userName = model;
                        })   
                      }, 20);
                    }
                    setTimeout(function () {
                     scope.$apply(function(){
                       elm.removeClass('saved');
                     })   
                    }, 3000);
 
                  }
                  else {
                    if (data.status==="bad_token") {
                      ipCookie('error_type', 'Session Expired');
                      window.location.assign('http://example.com/presenter');
                    }
                  }
                })
                .error (function(data, status, headers, config){
                  alert("Cannot connect do database");
                })
            })
        }
    }
})    


.directive('mySlider', function($http, $document, ipCookie){
  return {

    compile: function compile (tElement, tAttrs, transclude){
      return{
        post: function postLink(scope, element, attr){
          var id = ipCookie('currentEvent');
          var url = "http://example.com/showEvent/"+id;
          var abc = ipCookie("abc");
          var userToken = ipCookie('userToken');
          var status,
          startX = 0,
          x=0;
        
          $http.get(url, {params: {token: userToken, password: abc}}).
          success(function(data){
            if (data.status=="ok"){
              status = data.active;
              if (status == '1'){
                element.css({left: 0});
              }
              else {
                element.css({left: -47});
              }
            }
          });
          element.css({cursor: 'pointer'});

          element.draggable(  
          {
          axis: 'x',
          distance: 5,
          cursor: 'move',
          drag: function(event, ui){
          if(ui.position.left<-47) {
                 ui.position.left = -47;
              }
              if(ui.position.left>0){
                 ui.position.left = 0;
              }
      
          },
          stop: function(event, ui){
            if(ui.position.left<-24) {
                $( "#block" ).animate({ left: "-47px" }, 300 );  
                changeStatus(0);
              }     
              if(ui.position.left>=-24) {
                 $("#block").animate({"left": "0px"},300);  
                 changeStatus(1);
               }            
        
          }
          });

          element.click(function() {
            if(status=="1"){
              $("#block").animate({ left: "-47px" }, 300 );  
              changeStatus(0);
             }
            else{
              $( "#block" ).animate({ left: "0px" }, 300 );  
              changeStatus(1);
            } 
          });

          function changeStatus(i){
            if (status!=i){
              status = i;
              if (i==1)   
                var url = 'http://example.com/activateEvent/' + id;
              if (i == 0)
                var url = "http://example.com/deactivateEvent/" + id;
              $http.get(url, {params: {token: userToken}}).
              success(function(data){
              });
            }
          }
        }, 
      }
    }
  };
})

.directive('pdfFrame', function($http, ipCookie,  $upload){
  return{
    link: function (scope, element, attr) {
 
      var a = "";  
      for (var i = 0; i <= 10; i++) {
      a += Math.floor((Math.random()*10)+1); 
      };
      element.empty();
      element.append('<div class=ins id=' + a + '></div>');
 
      scope.load3 = function (path){
        if(path !=undefined && path !="") {
          path += '.pdf';
          var myPDF = "";
          var params = {url: path, pdfOpenParams: {
            navpanes: 1,
            statusbar: 0,
            view: "FitH",
          }};
          myPDF = new PDFObject(params).embed(a);   
        }
      }
     var path= scope.session.path;
     if (path !=" " && path !=undefined ) {
        scope.load3(path);
      }      
    }
  } 
})

  .directive('passwordValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
            scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
            scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
            scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

            if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
              ctrl.$setValidity('pwd', true);
              return viewValue;
            } else {
              ctrl.$setValidity('pwd', false);                    
              return undefined;
            }

            });
        }
    };  
  })

  .directive('requireValidate', function() {
    return {

        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var val = elm.val();
                console.log(val);
             scope.pwdValidLength = (val && val.length >= 1 ? 'valid' : undefined);
            if(scope.pwdValidLength) {
              ctrl.$setValidity('elm', true);
            } else {
              ctrl.$setValidity('elm', false);                    
            }
            ctrl.$parsers.unshift(function(viewValue) {
                scope.pwdValidLength = (viewValue && viewValue.length >= 1 ? 'valid' : undefined);
                if(scope.pwdValidLength) {

                    ctrl.$setValidity('elm', true);
                    return viewValue;
                } else {
                   ctrl.$setValidity('elm', false);                    
                   return undefined;
                }

            });
        }
    };
  })


  .directive('termsCheck', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if(viewValue==true) {
                    ctrl.$setValidity('ter', true);
                    return viewValue;
                } else {
                   ctrl.$setValidity('ter', false);                    
                   return undefined;
                }

            });
        }
    };
  })

  .directive('mailValidate', function() {
    return {

        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var val = elm.val();
            scope.pwdValidLength = (val && val.length >= 1 ? 'valid' : undefined);
            if(scope.pwdValidLength) {
              ctrl.$setValidity('elm', true);
            } else {
              ctrl.$setValidity('elm', false);                    
            }
            ctrl.$parsers.unshift(function(viewValue) {

                scope.pwdValidLength = (viewValue && viewValue.length >= 1 ? 'valid' : undefined);
                var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                scope.mailValid = (viewValue.match(pattern) ? 'valid' : undefined);
                if(scope.pwdValidLength && scope.mailValid) {
                    ctrl.$setValidity('elm', true);
                    return viewValue;
                } else {
                   ctrl.$setValidity('elm', false);                    
                   return undefined;
                }

            });
        }
    };
  })


.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}])

.directive('dateCheck', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
          var firstDate = '#' + attrs.dateCheck;
          elem.add(firstDate).on('change', function () {
            scope.$apply(function () {
              var firstDateVal = new Date($('#' + attrs.dateCheck).val());
              var secondDateVal = new Date(elem.val());
              var v = firstDateVal<=secondDateVal;
              if (v == false){  
                    var model = attrs.ngModel;
                      var nVal = $('#' + attrs.dateCheck).val();
                      $parse(model).assign(scope, nVal);
                  }
                    ctrl.$setValidity('secDate', v);
                });
            });
        }
    }
})


  .directive('requireValidate2', function($http) {
    return {

        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
				var linkAd = 'http://api.zippopotam.us/us/' + viewValue;
			$http.get(linkAd).success(function(data){
				if(data.places[0]['place name']!=''){
					scope.a.city = data.places[0]['place name'];
					scope.a.zip=viewValue;    
					for (var index = 0; index < scope.states.length; ++index) {
						if(scope.states[index].abbr==data.places[0]['state abbreviation']){
							scope.a.state=scope.states[index];
						}
					}	
				}
				else {
					scope.a.city = '';    
					scope.a.state = '';    
				}
			}).error();
				
            });
        }
    };
	  
  });