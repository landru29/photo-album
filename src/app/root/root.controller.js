angular.module("application").controller("RootCtrl", function (resourcePhoto) {
    "use strict";

    this.message = "Yeah!";

    resourcePhoto.query().$promise.then(
        function (data, headers) {
            console.log(data);
        },
        function (err) {
            console.log(err);
        }
    );
});
