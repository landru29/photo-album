angular.module("application").config(function ($stateProvider) {
    "use strict";
    $stateProvider.state("root", {
        url: "/",
        views: {
            mainView: {
                templateUrl: "app/root/root.html",
                controller: "RootCtrl",
                controllerAs: "Root"
            }
        },
        translations: []
    });
});
