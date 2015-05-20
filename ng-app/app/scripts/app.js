'use strict';

angular.module('nereidProjectApp', [
  'ui.router',
  'ngMaterial',
  'openlabs.angular-nereid-auth'
  ])
  .config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider
      .when('', '/')
      .otherwise('/404');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        publicAccess: true
      })

      .state('404', {
        url: '/404',
        templateUrl: 'views/404.html'
      })

      .state('base', {
        url: '/',
        templateUrl: 'views/base.html',
        controller: 'BaseCtrl'
      });

      $mdThemingProvider.theme('default')
      .primaryPalette('light-blue', {
        'default': '500'
      })
      .accentPalette('pink');
      $mdThemingProvider.theme('input', 'default')
      .primaryPalette('grey');
  })
  .run(['$rootScope', '$state', 'nereidAuth', function ($rootScope, $state, nereidAuth) {
    nereidAuth.refreshUserInfo(); // XXX: why?

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (!toState.publicAccess && !nereidAuth.isLoggedIn()) {
        // Redirect to login page if viewing non public page and not logged-In.
        $state.go('login');
      }
    });

    $rootScope.$on('nereid-auth:loginRequired', function () {
      nereidAuth.logoutUser();
    });

    $rootScope.$on('nereid-auth:logout', function () {
      $state.go('login');
    });
  }]);
