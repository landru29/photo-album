angular.module("application").controller("RootCtrl", function (resourcePhoto) {
    "use strict";
    var self = this;

    resourcePhoto.query().$promise.then(
        function (data, headers) {
            console.log(data);
            self.photos = data.values;
            self.links = data.links;
            self.TotalCount = data.TotalCount;
        },
        function (err) {
            console.log(err);
        }
    );
});
